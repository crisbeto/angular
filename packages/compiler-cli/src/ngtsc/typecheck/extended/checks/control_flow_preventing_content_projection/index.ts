/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AST, createCssSelectorFromNode, CssSelector, SelectorMatcher, TmplAstElement, TmplAstForLoopBlock, TmplAstIfBlock, TmplAstIfBlockBranch, TmplAstNode, TmplAstTemplate, TmplAstText} from '@angular/compiler';
import ts from 'typescript';

import {ErrorCode, ExtendedTemplateDiagnosticName} from '../../../../diagnostics';
import {NgTemplateDiagnostic} from '../../../api';
import {TemplateCheckFactory, TemplateCheckWithVisitor, TemplateContext} from '../../api';

/**
 * A check that finds and flags control flow nodes that interfere with content projection.
 *
 * Context:
 * `@if` and `@for` try to emulate the content projection behavior of `*ngIf` and `*ngFor`
 * in order to reduce breakages when moving from one syntax to the other (see #52414), however the
 * approach only works if there's only one element at the root of the control flow expression.
 * This means that a stray sibling node (e.g. text) can prevent an element from being projected
 * into the right slot. The purpose of the `TcbOp` is to find any places where a node at the root
 * of a control flow expression *would have been projected* into a specific slot, if the control
 * flow node didn't exist.
 */
class ControlFlowContentProjectionCheck extends
    TemplateCheckWithVisitor<ErrorCode.CONTROL_FLOW_PREVENTING_CONTENT_PROJECTION> {
  override code = ErrorCode.CONTROL_FLOW_PREVENTING_CONTENT_PROJECTION as const;

  override visitNode(
      ctx: TemplateContext<ErrorCode.CONTROL_FLOW_PREVENTING_CONTENT_PROJECTION>,
      component: ts.ClassDeclaration, node: TmplAstNode|AST):
      NgTemplateDiagnostic<ErrorCode.CONTROL_FLOW_PREVENTING_CONTENT_PROJECTION>[] {
    if (!(node instanceof TmplAstElement)) {
      return [];
    }

    const symbol = ctx.templateTypeChecker.getSymbolOfNode(node, component);
    const meta = symbol?.directives.find(dir => dir.isComponent) || null;
    const selectors = meta === null ? null : meta.ngContentSelectors;

    // We don't need to generate anything for components that don't have projection
    // slots, or they only have one catch-all slot (represented by `*`).
    if (meta === null || selectors === null || selectors.length === 0 ||
        (selectors.length === 1 && selectors[0] === '*')) {
      return [];
    }

    const preservesWhitespaces =
        ctx.templateTypeChecker.getDirectiveMetadata(component)?.preserveWhitespaces || false;
    const controlFlowToCheck = this.findPotentialControlFlowNodes(node, preservesWhitespaces);
    const diagnostics:
        NgTemplateDiagnostic<ErrorCode.CONTROL_FLOW_PREVENTING_CONTENT_PROJECTION>[] = [];

    if (controlFlowToCheck.length > 0) {
      const matcher = new SelectorMatcher<string>();

      for (const selector of selectors) {
        // `*` is a special selector for the catch-all slot.
        if (selector !== '*') {
          matcher.addSelectables(CssSelector.parse(selector), selector);
        }
      }

      for (const root of controlFlowToCheck) {
        for (const child of root.children) {
          if (child instanceof TmplAstElement || child instanceof TmplAstTemplate) {
            matcher.match(createCssSelectorFromNode(child), (_, originalSelector) => {
              const message = this.getDiagnosticMessage(
                  root, meta.tsSymbol.name, originalSelector, preservesWhitespaces);
              diagnostics.push(ctx.makeTemplateDiagnostic(child.sourceSpan, message));
            });
          }
        }
      }
    }

    return diagnostics;
  }

  private findPotentialControlFlowNodes(
      rootNode: TmplAstElement, hostPreserveWhitespaces: boolean) {
    const result: Array<TmplAstIfBlockBranch|TmplAstForLoopBlock> = [];

    for (const child of rootNode.children) {
      let eligibleNode: TmplAstForLoopBlock|TmplAstIfBlockBranch|null = null;

      // Only `@for` blocks and the first branch of `@if` blocks participate in content projection.
      if (child instanceof TmplAstForLoopBlock) {
        eligibleNode = child;
      } else if (child instanceof TmplAstIfBlock) {
        eligibleNode = child.branches[0];  // @if blocks are guaranteed to have at least one branch.
      }

      // Skip nodes with less than two children since it's impossible
      // for them to run into the issue that we're checking for.
      if (eligibleNode === null || eligibleNode.children.length < 2) {
        continue;
      }

      // Count the number of root nodes while skipping empty text where relevant.
      const rootNodeCount = eligibleNode.children.reduce((count, node) => {
        if (!(node instanceof TmplAstText) || hostPreserveWhitespaces ||
            node.value.trim().length > 0) {
          count++;
        }

        return count;
      }, 0);

      // Content projection can only be affected if there is more than one root node.
      if (rootNodeCount > 1) {
        result.push(eligibleNode);
      }
    }

    return result;
  }

  private getDiagnosticMessage(
      controlFlowNode: TmplAstIfBlockBranch|TmplAstForLoopBlock, componentName: string,
      slotSelector: string, hostPreservesWhitespaces: boolean) {
    const blockName = controlFlowNode instanceof TmplAstIfBlockBranch ? '@if' : '@for';
    const lines = [
      `Node matches the "${slotSelector}" slot of the "${
          componentName}" component, but will not be projected into the specific slot because the surrounding ${
          blockName} has more than one node at its root. To project the node in the right slot, you can:\n`,
      `1. Wrap the content of the ${blockName} block in an <ng-container/> that matches the "${
          slotSelector}" selector.`,
      `2. Split the content of the ${blockName} block across multiple ${
          blockName} blocks such that each one only has a single projectable node at its root.`,
      `3. Remove all content from the ${blockName} block, except for the node being projected.`
    ];

    if (hostPreservesWhitespaces) {
      lines.push(
          'Note: the host component has `preserveWhitespaces: true` which may ' +
          'cause whitespace to affect content projection.');
    }

    return lines.join('\n');
  }
}

export const factory: TemplateCheckFactory<
    ErrorCode.CONTROL_FLOW_PREVENTING_CONTENT_PROJECTION,
    ExtendedTemplateDiagnosticName.CONTROL_FLOW_PREVENTING_CONTENT_PROJECTION> = {
  code: ErrorCode.CONTROL_FLOW_PREVENTING_CONTENT_PROJECTION,
  name: ExtendedTemplateDiagnosticName.CONTROL_FLOW_PREVENTING_CONTENT_PROJECTION,
  create: () => {
    return new ControlFlowContentProjectionCheck();
  },
};
