/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {resolveForwardRef} from '../../di';
import {RuntimeError, RuntimeErrorCode} from '../../errors';
import {Type} from '../../interface/type';
import {EMPTY_OBJ} from '../../util/empty';
import {getComponentDef, getDirectiveDef} from '../definition';
import {diPublicInInjector, getOrCreateNodeInjectorForNode} from '../di';
import {DirectiveDef} from '../interfaces/definition';
import {TContainerNode, TElementContainerNode, TElementNode} from '../interfaces/node';
import {LView, TView} from '../interfaces/view';

/** Values that can be used to define a host directive. */
type HostDirectiveConfig = Type<unknown>|{
  directive: Type<unknown>;
  inputs?: string[];
  outputs?: string[];
};

type HostDirectiveDefinition = {
  directive: Type<unknown>; inputs: HostDirectiveMapping; outputs: HostDirectiveMapping;
};

type HostDirectiveMapping = {
  [publicName: string]: string
};

/**
 * This feature add the host directives behavior to a directive definition by patching a
 * function onto it. The expectation is that the runtime will invoke the function during
 * directive matching.
 *
 * For example:
 * ```ts
 * class ComponentWithHostDirective {
 *   static ɵcmp = defineComponent({
 *    type: ComponentWithHostDirective,
 *    features: [ɵɵHostDirectivesFeature([
 *      SimpleHostDirective,
 *      {directive: AdvancedHostDirective, inputs: ['foo: alias'], outputs: ['bar']},
 *    ])]
 *  });
 * }
 * ```
 *
 * @codeGenApi
 */
export function ɵɵHostDirectivesFeature(rawHostDirectives: HostDirectiveConfig[]|
                                        (() => HostDirectiveConfig[])) {
  return (definition: DirectiveDef<unknown>) => {
    definition.applyHostDirectives = applyHostDirectives;
    definition.hostDirectives =
        (Array.isArray(rawHostDirectives) ? rawHostDirectives : rawHostDirectives()).map(dir => {
          return typeof dir === 'function' ?
              {directive: resolveForwardRef(dir), inputs: EMPTY_OBJ, outputs: EMPTY_OBJ} :
              {
                directive: resolveForwardRef(dir.directive),
                inputs: bindingArrayToMap(dir.inputs),
                outputs: bindingArrayToMap(dir.outputs)
              };
        });
  };
}

function applyHostDirectives(
    tView: TView, viewData: LView, tNode: TElementNode|TContainerNode|TElementContainerNode,
    def: DirectiveDef<unknown>, matches: any[],
    hostDirectiveResults: WeakMap<DirectiveDef<unknown>, HostDirectiveDefinition>): void {
  if (def.hostDirectives !== null) {
    // Iterate in reverse so the directive that declares
    // the host directives preserves its original order.
    for (let i = def.hostDirectives.length - 1; i > -1; i--) {
      const hostDirectiveReference = def.hostDirectives[i].directive;
      const hostDirectiveDef = getDirectiveDef(hostDirectiveReference)!;

      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        validateHostDirective(hostDirectiveReference, hostDirectiveDef, matches);
      }

      // Allows for the directive to be injected by the host.
      diPublicInInjector(
          getOrCreateNodeInjectorForNode(tNode, viewData), tView, hostDirectiveDef.type);

      // Host directives execute before the host so that its host bindings can be overwritten.
      matches.unshift(hostDirectiveDef);
      hostDirectiveResults.set(hostDirectiveDef, def.hostDirectives[i]);
      applyHostDirectives(tView, viewData, tNode, hostDirectiveDef, matches, hostDirectiveResults);
    }
  }
}

function validateHostDirective(
    reference: Type<unknown>, def: DirectiveDef<unknown>|null,
    matches: any[]): asserts def is DirectiveDef<unknown> {
  if (def === null) {
    if (getComponentDef(reference) !== null) {
      throw new RuntimeError(
          RuntimeErrorCode.HOST_DIRECTIVE_COMPONENT,
          `Host directive ${reference.name} cannot be a component.`);
    }

    throw new RuntimeError(
        RuntimeErrorCode.HOST_DIRECTIVE_UNRESOLVABLE,
        `Could not resolve metadata for host directive ${reference.name}.`);
  }

  if (!def.standalone) {
    throw new RuntimeError(
        RuntimeErrorCode.HOST_DIRECTIVE_NOT_STANDALONE,
        `Host directive ${def.type.name} must be standalone.`);
  }

  if (matches.indexOf(def) > -1) {
    throw new RuntimeError(
        RuntimeErrorCode.DUPLICATE_DIRECTITVE,
        `Directive ${def.type.name} matches multiple times on the same element. ` +
            `Directives can only match an element once.`);
  }
}

function bindingArrayToMap(bindings: string[]|undefined): HostDirectiveMapping {
  if (bindings === undefined || bindings.length === 0) {
    return EMPTY_OBJ;
  }

  const result: HostDirectiveMapping = {};

  for (let i = 1; i < bindings.length; i += 2) {
    result[bindings[i - 1]] = bindings[i];
  }

  return result;
}
