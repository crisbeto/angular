const _c0 = function (a0) {
  return {
    expr1Alias: a0
  };
};
const _c1 = function (a0) {
  return {
    expr3Alias: a0
  };
};
…
function MyApp_Template(rf, ctx) {
  if (rf & 1) {
    $r3$.ɵɵtemplate(0, MyApp_Conditional_0_Template, 1, 0);
    $r3$.ɵɵtemplate(1, MyApp_Conditional_1_Template, 1, 0);
    $r3$.ɵɵtemplate(2, MyApp_Conditional_2_Template, 1, 0);
    $r3$.ɵɵtemplate(3, MyApp_Conditional_3_Template, 1, 0);
    $r3$.ɵɵtemplate(4, MyApp_Conditional_4_Template, 1, 0);
    $r3$.ɵɵtemplate(5, MyApp_Conditional_5_Template, 1, 0);
  }
  if (rf & 2) {
    let MyApp_contFlowTmp;
    $r3$.ɵɵconditional(0, (MyApp_contFlowTmp = $r3$.ɵɵpureFunction1(5, _c0, ctx.expr1)).expr1Alias ? 0 : (MyApp_contFlowTmp = undefined) || ctx.expr2 ? 1 : (MyApp_contFlowTmp = $r3$.ɵɵpureFunction1(7, _c1, ctx.expr3)).expr3Alias ? 2 : (MyApp_contFlowTmp = undefined) || ctx.expr4 ? 3 : ctx.expr5 ? 4 : 5, MyApp_contFlowTmp);
  }
}
