/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {
  BindingType,
  CssSelector,
  makeBindingParser,
  ParsedEvent,
  ParseSourceSpan,
  TmplAstBoundAttribute,
  TmplAstBoundEvent,
  TmplAstHostElement,
  BindingParser,
  AbsoluteSourceSpan,
  ParseSpan,
  PropertyRead,
  ParsedEventType,
  Call,
  ThisReceiver,
  KeyedRead,
  LiteralPrimitive,
  ImplicitReceiver,
  AST,
} from '@angular/compiler';
import ts from 'typescript';
import {createSourceSpan} from '../../annotations/common';
import {ClassDeclaration} from '../../reflection';

/**
 * Comment attached to an AST node that serves as a marker to distinguish nodes
 * used for type checking host bindings from ones used for templates.
 */
const MARKER_COMMENT_TEXT = 'hostBindings';

/** Node that represent a static name of a member. */
type StaticName = ts.Identifier | ts.StringLiteralLike;

/** Property assignment node with a static name and initializer. */
type StaticPropertyAssignment = ts.PropertyAssignment & {
  name: StaticName;
  initializer: ts.StringLiteralLike;
};

/**
 * Creates an AST node that represents the host element of a directive.
 * Can return null if there are no valid bindings to be checked.
 * @param type Whether the host element is for a directive or a component.
 * @param selector Selector of the directive.
 * @param sourceNode Class declaration for the directive.
 * @param literal `host` object literal from the decorator.
 * @param bindingDecorators `HostBinding` decorators discovered on the node.
 * @param listenerDecorators `HostListener` decorators discovered on the node.
 */
export function createHostElement(
  type: 'component' | 'directive',
  selector: string | null,
  sourceNode: ClassDeclaration,
  literal: ts.ObjectLiteralExpression | null,
  bindingDecorators: Iterable<ts.Decorator>,
  listenerDecorators: Iterable<ts.Decorator>,
): TmplAstHostElement | null {
  const bindings: TmplAstBoundAttribute[] = [];
  const listeners: TmplAstBoundEvent[] = [];
  let parser: BindingParser | null = null;

  if (literal !== null) {
    for (const prop of literal.properties) {
      // We only support type checking of static bindings.
      if (
        ts.isPropertyAssignment(prop) &&
        ts.isStringLiteralLike(prop.initializer) &&
        isStaticName(prop.name)
      ) {
        parser ??= makeBindingParser();
        createNodeFromHostLiteralProperty(
          prop as StaticPropertyAssignment,
          parser,
          bindings,
          listeners,
        );
      }
    }
  }

  for (const decorator of bindingDecorators) {
    createNodeFromBindingDecorator(decorator, bindings);
  }

  for (const decorator of listenerDecorators) {
    createNodeFromListenerDecorator(decorator, listeners);
  }

  // The element will be a no-op if there are no bindings.
  if (bindings.length === 0 && listeners.length === 0) {
    return null;
  }

  const tagNames: string[] = [];

  if (selector !== null) {
    const parts = CssSelector.parse(selector);

    for (const part of parts) {
      if (part.element !== null) {
        tagNames.push(part.element);
      }
    }
  }

  // If none of the selectors have a tag name, fall back to `ng-component`/`ng-directive`.
  // This is how the runtime handles component's without tag names as well.
  if (tagNames.length === 0) {
    tagNames.push(`ng-${type}`);
  }

  return new TmplAstHostElement(tagNames, bindings, listeners, createSourceSpan(sourceNode.name));
}

/**
 * Creates an AST node that can be used to distinguish TypeScript nodes used
 * for checking host bindings from ones used for checking templates.
 */
export function createHostBindingsMarker(): ts.Expression {
  // Note that the comment text is quite generic. This doesn't really matter, because it is
  // used only inside a TCB and there's no way for users to produce a comment there.
  // `true /*hostBindings*/`.
  const trueExpr = ts.addSyntheticTrailingComment(
    ts.factory.createTrue(),
    ts.SyntaxKind.MultiLineCommentTrivia,
    MARKER_COMMENT_TEXT,
  );
  // Wrap the expression in parentheses to ensure that the comment is attached to the correct node.
  return ts.factory.createParenthesizedExpression(trueExpr);
}

/**
 * Determines if a given node is a marker that descendant nodes are used to check host bindings.
 * Needs to be kept in sync with `createHostBindingsMarker`.
 */
export function isHostBindingsMarker(node: ts.Expression): boolean {
  if (!ts.isParenthesizedExpression(node) || node.expression.kind !== ts.SyntaxKind.TrueKeyword) {
    return false;
  }

  const text = node.getSourceFile().text;
  return (
    ts.forEachTrailingCommentRange(
      text,
      node.expression.getEnd(),
      (pos, end, kind) =>
        kind === ts.SyntaxKind.MultiLineCommentTrivia &&
        text.substring(pos + 2, end - 2) === MARKER_COMMENT_TEXT,
    ) || false
  );
}

/**
 * If possible, creates and tracks the relevant AST node for a binding declared
 * through a property on the `host` literal.
 * @param prop Property to parse.
 * @param parser Binding parser used to parse the expressions.
 * @param bindings Array tracking the bound attributes of the host element.
 * @param listeners Array tracking the event listeners of the host element.
 */
function createNodeFromHostLiteralProperty(
  property: StaticPropertyAssignment,
  parser: BindingParser,
  bindings: TmplAstBoundAttribute[],
  listeners: TmplAstBoundEvent[],
): void {
  const {name, initializer} = property;

  if (name.text.startsWith('[') && name.text.endsWith(']')) {
    const {attrName, type} = inferBoundAttribute(name.text.slice(1, -1));
    const valueSpan = createStaticExpressionSpan(initializer);
    bindings.push(
      new TmplAstBoundAttribute(
        attrName,
        type,
        0,
        parser.parseBinding(initializer.text, true, valueSpan, valueSpan.start.offset),
        null,
        createSourceSpan(property),
        createStaticExpressionSpan(name),
        valueSpan,
        undefined,
      ),
    );
  } else if (name.text.startsWith('(') && name.text.endsWith(')')) {
    const events: ParsedEvent[] = [];
    parser.parseEvent(
      name.text.slice(1, -1),
      initializer.text,
      false,
      createSourceSpan(property),
      createStaticExpressionSpan(initializer),
      [],
      events,
      createStaticExpressionSpan(name),
    );

    if (events.length !== 1) {
      throw new Error('Failed to parse event binding');
    }

    listeners.push(TmplAstBoundEvent.fromParsedEvent(events[0]));
  }
}

/**
 * If possible, creates and tracks a bound attribute node from a `HostBinding` decorator.
 * @param decorator Decorator from which to create the node.
 * @param bindings Array tracking the bound attributes of the host element.
 */
function createNodeFromBindingDecorator(
  decorator: ts.Decorator,
  bindings: TmplAstBoundAttribute[],
): void {
  // We only support decorators that are being called.
  if (!ts.isCallExpression(decorator.expression)) {
    return;
  }

  const args = decorator.expression.arguments;
  const property = decorator.parent;
  let nameNode: StaticName | null = null;
  let propertyName: StaticName | null = null;

  if (property && ts.isPropertyDeclaration(property) && isStaticName(property.name)) {
    propertyName = property.name;
  }

  // The first parameter is optional. If omitted, the name
  // of the class member is used as the property.
  if (args.length === 0) {
    nameNode = propertyName;
  } else if (ts.isStringLiteralLike(args[0])) {
    nameNode = args[0];
  } else {
    return;
  }

  if (nameNode === null || propertyName === null) {
    return;
  }

  // We can't synthesize a fake expression here and pass it through the binding parser, because
  // it constructs all the spans based on the source code origin and they aren't easily mappable
  // back to the source. E.g. `@HostBinding('foo') id = '123'` in source code would look
  // something like `[foo]="this.id"` in the AST. Instead we construct the expressions
  // manually here. Note that we use a dummy span with -1/-1 as offsets, because it isn't
  // used for type checking and constructing it accurately would take some effort.
  const span = new ParseSpan(-1, -1);
  const propertyStart = property.getStart();
  const receiver = new ThisReceiver(span, new AbsoluteSourceSpan(propertyStart, propertyStart));
  const nameSpan = new AbsoluteSourceSpan(propertyName.getStart(), propertyName.getEnd());
  const read = ts.isIdentifier(propertyName)
    ? new PropertyRead(span, nameSpan, nameSpan, receiver, propertyName.text)
    : new KeyedRead(
        span,
        nameSpan,
        receiver,
        new LiteralPrimitive(span, nameSpan, propertyName.text),
      );
  const {attrName, type} = inferBoundAttribute(nameNode.text);

  bindings.push(
    new TmplAstBoundAttribute(
      attrName,
      type,
      0,
      read,
      null,
      createSourceSpan(decorator),
      createStaticExpressionSpan(nameNode),
      createSourceSpan(decorator),
      undefined,
    ),
  );
}

/**
 * If possible, creates and tracks a bound event node from a `HostBinding` decorator.
 * @param decorator Decorator from which to create the node.
 * @param bindings Array tracking the bound events of the host element.
 */
function createNodeFromListenerDecorator(
  decorator: ts.Decorator,
  listeners: TmplAstBoundEvent[],
): void {
  // We only support decorators that are being called with at least one argument.
  if (!ts.isCallExpression(decorator.expression) || decorator.expression.arguments.length === 0) {
    return;
  }

  const args = decorator.expression.arguments;
  const method = decorator.parent;

  // Only handle decorators that are statically analyzable.
  if (
    !method ||
    !ts.isMethodDeclaration(method) ||
    !isStaticName(method.name) ||
    !ts.isStringLiteralLike(args[0])
  ) {
    return;
  }

  // We can't synthesize a fake expression here and pass it through the binding parser, because
  // it constructs all the spans based on the source code origin and they aren't easily mappable
  // back to the source. E.g. `@HostListener('foo') handleFoo() {}` in source code would look
  // something like `(foo)="handleFoo()"` in the AST. Instead we construct the expressions
  // manually here. Note that we use a dummy span with -1/-1 as offsets, because it isn't
  // used for type checking and constructing it accurately would take some effort.
  const span = new ParseSpan(-1, -1);
  const [name, phase] = method.name.text.split('.');
  const argNodes: AST[] = [];
  const methodStart = method.getStart();
  const methodReceiver = new ThisReceiver(span, new AbsoluteSourceSpan(methodStart, methodStart));
  const nameSpan = new AbsoluteSourceSpan(method.name.getStart(), method.name.getEnd());
  const receiver = ts.isIdentifier(method.name)
    ? new PropertyRead(span, nameSpan, nameSpan, methodReceiver, method.name.text)
    : new KeyedRead(
        span,
        nameSpan,
        methodReceiver,
        new LiteralPrimitive(span, nameSpan, method.name.text),
      );

  if (args.length > 1 && ts.isArrayLiteralExpression(args[1])) {
    for (const expr of args[1].elements) {
      // Stop the process if we can't resolve a specific parameter.
      if (!ts.isStringLiteralLike(expr)) {
        return;
      }

      const start = expr.getStart();
      const end = expr.getEnd();
      const exprSourceSpan = new AbsoluteSourceSpan(start, end);
      argNodes.push(
        new PropertyRead(
          span,
          exprSourceSpan,
          exprSourceSpan,
          new ImplicitReceiver(span, new AbsoluteSourceSpan(start, start)),
          expr.text,
        ),
      );
    }
  }

  const callNode = new Call(span, nameSpan, receiver, argNodes, span);

  listeners.push(
    new TmplAstBoundEvent(
      name,
      name.startsWith('@') ? ParsedEventType.Animation : ParsedEventType.Regular,
      callNode,
      null,
      phase,
      createSourceSpan(decorator),
      createSourceSpan(decorator),
      createStaticExpressionSpan(method.name),
    ),
  );
}

/**
 * Infers the attribute name and binding type of a bound attribute based on its raw name.
 * @param name Name from which to infer the information.
 */
function inferBoundAttribute(name: string): {attrName: string; type: BindingType} {
  const attrPrefix = 'attr.';
  const classPrefix = 'class.';
  const stylePrefix = 'style.';
  const animationPrefix = '@';
  let attrName: string;
  let type: BindingType;

  // Infer the binding type based on the prefix.
  if (name.startsWith(attrPrefix)) {
    attrName = name.slice(attrPrefix.length);
    type = BindingType.Attribute;
  } else if (name.startsWith(classPrefix)) {
    attrName = name.slice(classPrefix.length);
    type = BindingType.Class;
  } else if (name.startsWith(stylePrefix)) {
    attrName = name.slice(stylePrefix.length);
    type = BindingType.Style;
  } else if (name.startsWith(animationPrefix)) {
    attrName = name.slice(animationPrefix.length);
    type = BindingType.Animation;
  } else {
    attrName = name;
    type = BindingType.Property;
  }

  return {attrName, type};
}

/** Checks whether the specified node is a static name node. */
function isStaticName(node: ts.Node): node is StaticName {
  return ts.isIdentifier(node) || ts.isStringLiteralLike(node);
}

/** Creates a `ParseSourceSpan` pointing to a static expression AST node's source. */
function createStaticExpressionSpan(node: ts.StringLiteralLike | ts.Identifier): ParseSourceSpan {
  const span = createSourceSpan(node);

  // Offset by one on both sides to skip over the quotes.
  if (ts.isStringLiteralLike(node)) {
    span.fullStart = span.fullStart.moveBy(1);
    span.start = span.start.moveBy(1);
    span.end = span.end.moveBy(-1);
  }

  return span;
}
