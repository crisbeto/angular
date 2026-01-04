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

export function identifyCallbacks(job: CompilationJob): void {
  for (const unit of job.units) {
    for (const op of unit.ops()) {
      ir.transformExpressionsInOp(
        op,
        (expr) => (expr instanceof o.ArrowFunctionExpr ? transformArrowFunction(unit, expr) : expr),
        ir.VisitorContextFlag.None,
      );
    }
  }
}

function transformArrowFunction(
  unit: CompilationUnit,
  expr: o.ArrowFunctionExpr,
): ir.CallbackDefinitionExpr {
  const opList = new ir.OpList<ir.UpdateOp>();
  const innerOps: ir.UpdateOp[] = Array.isArray(expr.body)
    ? expr.body.map((stmt) => ir.createStatementOp(stmt))
    : [ir.createStatementOp(new o.ReturnStatement(expr.body, expr.sourceSpan))];
  opList.push(innerOps);
  const analysis = {usesDollarEvent: false, hasContextReferences: false};

  ir.transformExpressionsInExpression(
    expr,
    (expr) => {
      if (expr instanceof ir.LexicalReadExpr) {
        if (expr.name === '$event') {
          analysis.usesDollarEvent = true;
        } else {
          analysis.hasContextReferences = true;
        }
      } else if (expr instanceof ir.ContextExpr) {
        analysis.hasContextReferences = true;
      }
      return expr;
    },
    ir.VisitorContextFlag.None,
  );

  const def = new ir.CallbackDefinitionExpr(expr, opList, analysis);
  unit.expressionsWithOps.add(def);
  return def;
}
