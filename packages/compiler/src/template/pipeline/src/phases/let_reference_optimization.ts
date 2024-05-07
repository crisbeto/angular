/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as ir from '../../ir';
import {CompilationJob} from '../compilation';

/**
 * Optimize references to `@let` declarations.
 *
 * If a `@let` declaration is used only in its declaration view, the `storeLet` call
 * can be avoided and the expression can be inlined into the variable declaration.
 */
export function optimizeLetReferences(job: CompilationJob): void {
  const varUsages = new Map<ir.XrefId, number>();
  const unoptimizableLets = new Set<ir.XrefId>();

  // Note: there are opportunities to save more bytes and slots by removing the corresponding
  // `declareLet` op whenever a `storeLet` is removed. We don't do it, because:
  // 1. Removing the `declareLet` will also remove the TNode which may break DI for pipes.
  // 2. We could decide not to remove `declareLet` if its expression uses pipes or if it is first
  //    in the instruction set, however that adds more mental overhead and could lead to obscure
  //    bugs in the future.

  // Since `@let` declarations can be referenced in child views, both in
  // the creation block (via listeners) and in the update block, we have
  // to look through all the ops to find the references.
  for (const unit of job.units) {
    for (const op of unit.ops()) {
      analyzeOp(unit.xref, op, varUsages, unoptimizableLets);
    }
  }

  for (const unit of job.units) {
    // Iterate the update the instructions in reverse since references
    // happen after the definition so they should be removed first.
    for (const op of unit.update.reversed()) {
      // If a let reference variable has no references, it can be removed. Most such cases
      // should've been picked up by the variable optimization phase, but there can still be
      // some left over if a @let is used in the expression of another @let and the latter
      // is optimized away.
      if (isLetReference(op) && (!varUsages.has(op.xref) || varUsages.get(op.xref) === 0)) {
        ir.OpList.remove<ir.UpdateOp>(op);
      } else if (op.kind === ir.OpKind.StoreLet && !unoptimizableLets.has(op.target)) {
        // We can only optimize the `storeLet` calls that aren't referenced by child views.
        optimizeStoreLet(op, varUsages);
      }
    }
  }
}

/**
 * Optimizes a `StoreLetOp`.
 * @param op Op to be optimized.
 * @param varUsages Map keeping track of variables and their usages.
 */
function optimizeStoreLet(op: ir.StoreLetOp, varUsages: Map<ir.XrefId, number>): void {
  // If an optimizable call is followed by a reference to itself, the two can be combined.
  // E.g. `storeLet(expr); const ref = reference(idx)` turns into `const ref = expr`.
  if (op.next !== null && isLetReference(op.next) && op.next.variable.target === op.target) {
    op.next.initializer = op.value.clone();
    ir.OpList.remove<ir.UpdateOp>(op);
    return;
  }

  // Otherwise we can drop the `storeLet` altogether. Note that we need to look through
  // the variable usages in its expression in order to update the reference count since
  // the expression won't exist anymore.
  ir.visitExpressionsInOp(op, (expr) => {
    if (expr instanceof ir.ReadVariableExpr && varUsages.has(expr.xref)) {
      varUsages.set(expr.xref, varUsages.get(expr.xref)! - 1);
    }
  });

  ir.OpList.remove<ir.UpdateOp>(op);
}

/**
 * Analyzes an op to count the variable usages inside of it and look for `@let` declarations.
 * @param unitXref Xref of the op's compilation unit.
 * @param op Op being analyzed.
 * @param varUsages Map keeping track of variables and their usages.
 * @param unoptimizableLets Set of xrefs of `@let` declarations that can't be optimized.
 */
function analyzeOp(
  unitXref: ir.XrefId,
  op: ir.CreateOp | ir.UpdateOp,
  varUsages: Map<ir.XrefId, number>,
  unoptimizableLets: Set<ir.XrefId>,
): void {
  ir.visitExpressionsInOp(op, (expr) => {
    if (expr instanceof ir.ReadVariableExpr) {
      varUsages.set(expr.xref, (varUsages.get(expr.xref) || 0) + 1);
    }
  });

  // If a variable from outside of the declaration view refers to a
  // `@let` declaration, it cannot be optimized since the value has
  // to be stored in order for the other view to retrieve it.
  if (isLetReference(op) && op.variable.view !== unitXref) {
    unoptimizableLets.add(op.variable.target);
  }

  // Listeners are technically in the same view, but they also retrieve values from
  // the view when they're invoked. This means that `@let` references inside of their
  // expressions will prevent the declaration from being optimized.
  if (op.kind === ir.OpKind.Listener || op.kind === ir.OpKind.TwoWayListener) {
    ir.visitExpressionsInOp(op, (expr) => {
      if (expr instanceof ir.ContextLetReferenceExpr) {
        unoptimizableLets.add(expr.target);
      }
    });
  }
}

/** Returns whether an op is a `VariableOp` that references a `@let` declaration. */
function isLetReference(op: ir.CreateOp | ir.UpdateOp): op is (
  | ir.VariableOp<ir.CreateOp>
  | ir.VariableOp<ir.UpdateOp>
) & {
  variable: ir.LetReferenceVariable;
} {
  return (
    op.kind === ir.OpKind.Variable && op.variable.kind === ir.SemanticVariableKind.LetReference
  );
}
