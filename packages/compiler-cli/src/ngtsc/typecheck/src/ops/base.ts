/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import {AbsoluteSourceSpan, ParseSourceSpan} from '@angular/compiler';
import ts from 'typescript';
import {CommentTriviaType, ExpressionIdentifier} from '../comments';

/**
 * A code generation operation that's involved in the construction of a Type Check Block.
 *
 * The generation of a TCB is non-linear. Bindings within a template may result in the need to
 * construct certain types earlier than they otherwise would be constructed. That is, if the
 * generation of a TCB for a template is broken down into specific operations (constructing a
 * directive, extracting a variable from a let- operation, etc), then it's possible for operations
 * earlier in the sequence to depend on operations which occur later in the sequence.
 *
 * `TcbOp` abstracts the different types of operations which are required to convert a template into
 * a TCB. This allows for two phases of processing for the template, where 1) a linear sequence of
 * `TcbOp`s is generated, and then 2) these operations are executed, not necessarily in linear
 * order.
 *
 * Each `TcbOp` may insert statements into the body of the TCB, and also optionally return a
 * `ts.Expression` which can be used to reference the operation's result.
 */
export abstract class TcbOp {
  /**
   * Set to true if this operation can be considered optional. Optional operations are only executed
   * when depended upon by other operations, otherwise they are disregarded. This allows for less
   * code to generate, parse and type-check, overall positively contributing to performance.
   */
  abstract readonly optional: boolean;

  abstract execute(): TcbNode | null;

  /**
   * Replacement value or operation used while this `TcbOp` is executing (i.e. to resolve circular
   * references during its execution).
   *
   * This is usually a `null!` expression (which asks TS to infer an appropriate type), but another
   * `TcbOp` can be returned in cases where additional code generation is necessary to deal with
   * circular references.
   */
  circularFallback(): TcbOp | TcbNode {
    // Value used to break a circular reference between `TcbOp`s.
    //
    // This value is returned whenever `TcbOp`s have a circular dependency. The
    // expression is a non-null assertion of the null value (in TypeScript, the
    // expression `null!`). This construction will infer the least narrow type
    // for whatever it's assigned to.
    return new TcbNode('null!');
  }
}

const IGNORE_FOR_DIAGNOSTICS_MARKER = `${CommentTriviaType.DIAGNOSTIC}:ignore`;

export class TcbNode {
  private static tempPrinter = ts.createPrinter();
  private leadingComment: string | null = null;
  private spanComment: string | null = null;
  private identifierComment: string | null = null;
  private ignoreComment: string | null = null;

  constructor(private source: string) {}

  // TODO: these should probably just be functions instead of static methods.

  static declareVariable(id: TcbNode, type: TcbNode) {
    type.addExpressionIdentifier(ExpressionIdentifier.VARIABLE_AS_EXPRESSION);
    return new TcbNode(`var ${id.print()} = null! as ${type.print()}`);
  }

  /** @deprecated Temporary method until all dependencies are moved away from TS. */
  static tempPrint(node: ts.Node, sourceFile: ts.SourceFile): string {
    return TcbNode.tempPrinter.printNode(ts.EmitHint.Unspecified, node, sourceFile);
  }

  static printAsBlock(nodes: TcbNode[]): string {
    let block = '{\n';
    for (const node of nodes) {
      block += node.printAsStatement() + '\n';
    }
    block += '}';
    return block;
  }

  markIgnoreDiagnostics() {
    this.ignoreComment = IGNORE_FOR_DIAGNOSTICS_MARKER;
    return this;
  }

  wrapForDiagnostics() {
    this.source = `(${this.print()})`;
    this.leadingComment = this.spanComment = this.identifierComment = this.ignoreComment = null;
    return this;
  }

  wrapForTypeChecker() {
    this.wrapForDiagnostics();
    return this;
  }

  addParseSpanInfo(span: AbsoluteSourceSpan | ParseSourceSpan) {
    let commentText: string;
    if (span instanceof AbsoluteSourceSpan) {
      commentText = `${span.start},${span.end}`;
    } else {
      commentText = `${span.start.offset},${span.end.offset}`;
    }

    this.spanComment = commentText;
    return this;
  }

  addExpressionIdentifier(identifier: ExpressionIdentifier) {
    this.identifierComment = `${CommentTriviaType.EXPRESSION_TYPE_IDENTIFIER}:${identifier}`;
    return this;
  }

  print(): string {
    const leading = this.leadingComment ? `/*${this.leadingComment}*/ ` : '';
    const identifier = this.identifierComment ? ` /*${this.identifierComment}*/` : '';
    const span = this.spanComment ? ` /*${this.spanComment}*/` : '';
    const ignore = this.ignoreComment ? ` /*${this.ignoreComment}*/` : '';
    return `${leading}${this.source}${identifier}${ignore}${span}`;
  }

  // TODO: we should probably have a `TcbStatement` node too. Revisit this once tests are passing.
  printAsStatement(): string {
    return this.print() + ';';
  }

  getSource() {
    return this.source;
  }

  toString() {
    throw new Error(
      `Convert the node to string through the print() method. Stringifying it may be a mistake`,
    );
  }
}
