/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import type {CompilationJob, CompilationUnit} from '../compilation';
import * as ir from '../../ir';
import * as o from '../../../../output/output_ast';

export function optimizeCallbacks(job: CompilationJob): void {
  const optimizedCallbacks = new Map<ir.CallbackDefinitionExpr, o.Expression>();

  for (const unit of job.units) {
    for (const op of unit.ops()) {
      ir.transformExpressionsInOp(
        op,
        (expr) => {
          return expr instanceof ir.CallbackDefinitionExpr
            ? optimize(expr, job, unit, optimizedCallbacks)
            : expr;
        },
        ir.VisitorContextFlag.None,
      );
    }
  }
}

function optimize(
  expr: ir.CallbackDefinitionExpr,
  job: CompilationJob,
  unit: CompilationUnit,
  cachedOptimizations: Map<ir.CallbackDefinitionExpr, o.Expression>,
): o.Expression {
  if (expr.analysis.usesDollarEvent) {
    return expr;
  }

  for (const [callback, replacement] of cachedOptimizations) {
    if (callback.isEquivalent(expr)) {
      return replacement;
    }
  }

  if (expr.analysis.hasContextReferences) {
    const storeOp = ir.createStoreCallbackOp(
      job.allocateXrefId(),
      expr.expression.params,
      expr.ops,
    );
    unit.create.push(storeOp);
    const newExpr = new ir.CallbackReferenceExpr(storeOp.xref, storeOp.handle);
    unit.expressionsWithOps.delete(expr);
    cachedOptimizations.set(expr, newExpr);
    return newExpr;
  }

  // TODO: still need to extract to constant pool
  return expr;
}
