/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {TmplAstTemplate, TmplAstVariable} from '@angular/compiler';
import {TcbNode, TcbOp} from './base';
import type {Context} from './context';
import type {Scope} from './scope';

/**
 * A `TcbOp` which renders a variable that is implicitly available within a block (e.g. `$count`
 * in a `@for` block).
 *
 * Executing this operation returns the identifier which can be used to refer to the variable.
 */
export class TcbBlockImplicitVariableOp extends TcbOp {
  constructor(
    private tcb: Context,
    private scope: Scope,
    private type: TcbNode,
    private variable: TmplAstVariable,
  ) {
    super();
  }

  override readonly optional = true;

  override execute(): TcbNode {
    const id = new TcbNode(this.tcb.allocateId()).addParseSpanInfo(this.variable.keySpan);
    // TODO: this might not be right. Previously it was being added as:
    // `addParseSpanInfo(variable.declarationList.declarations[0], this.variable.sourceSpan);`
    const variable = TcbNode.declareVariable(id, this.type).addParseSpanInfo(
      this.variable.sourceSpan,
    );
    this.scope.addStatement(variable);
    return id;
  }
}

/**
 * A `TcbOp` which creates an expression for particular let- `TmplAstVariable` on a
 * `TmplAstTemplate`'s context.
 *
 * Executing this operation returns a reference to the variable variable (lol).
 */
export class TcbTemplateVariableOp extends TcbOp {
  constructor(
    private tcb: Context,
    private scope: Scope,
    private template: TmplAstTemplate,
    private variable: TmplAstVariable,
  ) {
    super();
  }

  override get optional() {
    return false;
  }

  override execute(): TcbNode {
    // Look for a context variable for the template.
    const ctx = this.scope.resolve(this.template);

    // Allocate an identifier for the TmplAstVariable, and initialize it to a read of the variable
    // on the template context.
    const id = this.tcb.allocateId();
    const initializer = new TcbNode(`${ctx.print()}.${this.variable.value || '$implicit'}`);
    const idNode = new TcbNode(id);
    idNode.addParseSpanInfo(this.variable.keySpan);

    // Declare the variable, and return its identifier.
    let variable: TcbNode;
    // We already have idNode with keySpan.
    // We should use idNode in the statement.
    if (this.variable.valueSpan !== undefined) {
      initializer.addParseSpanInfo(this.variable.valueSpan);
      initializer.wrapForTypeChecker(); // TcbNode has this method
      // Attach sourceSpan to the wrapper (parenthesized expression)
      initializer.addParseSpanInfo(this.variable.sourceSpan);
      variable = new TcbNode(`var ${idNode.print()} = ${initializer.print()}`);
    } else {
      initializer.addParseSpanInfo(this.variable.sourceSpan);
      variable = new TcbNode(`var ${idNode.print()} = ${initializer.print()}`);
    }
    // variable.addParseSpanInfo(this.variable.sourceSpan);
    this.scope.addStatement(variable);
    return idNode;
  }
}

/**
 * A `TcbOp` which renders a variable defined inside of block syntax (e.g. `@if (expr; as var) {}`).
 *
 * Executing this operation returns the identifier which can be used to refer to the variable.
 */
export class TcbBlockVariableOp extends TcbOp {
  constructor(
    private tcb: Context,
    private scope: Scope,
    private initializer: TcbNode,
    private variable: TmplAstVariable,
  ) {
    super();
  }

  override get optional() {
    return false;
  }

  override execute(): TcbNode {
    const id = this.tcb.allocateId();
    const idNode = new TcbNode(id);
    idNode.addParseSpanInfo(this.variable.keySpan);

    this.initializer.wrapForTypeChecker();
    // Attach span to initializer (which is already wrapped)
    // We assume initializer expects sourceSpan.
    this.initializer.addParseSpanInfo(this.variable.sourceSpan);
    const variable = new TcbNode(`var ${idNode.print()} = ${this.initializer.print()}`);
    // variable.addParseSpanInfo(this.variable.sourceSpan);
    this.scope.addStatement(variable);
    return idNode;
  }
}
