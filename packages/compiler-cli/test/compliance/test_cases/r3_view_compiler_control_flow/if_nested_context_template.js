function MyApp_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    $r3$.ɵɵtext(0, " top level ");
  }
}

function MyApp_Conditional_1_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    $r3$.ɵɵtext(0);
  }
  if (rf & 2) {
    const alias_r2 = $r3$.ɵɵnextContext(2).alias;
    $r3$.ɵɵtextInterpolate(alias_r2);
  }
}

function MyApp_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    $r3$.ɵɵtemplate(0, MyApp_Conditional_1_Conditional_0_Conditional_0_Template, 1, 1);
  }
  if (rf & 2) {
    const ctx_r3 = $r3$.ɵɵnextContext(2);
    $r3$.ɵɵconditional(0, ctx_r3.value() !== 7 ? 0 : -1);
  }
}

function MyApp_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    $r3$.ɵɵtemplate(0, MyApp_Conditional_1_Conditional_0_Template, 1, 1);
  }
  if (rf & 2) {
    const ctx_r1 = $r3$.ɵɵnextContext();
    $r3$.ɵɵconditional(0, ctx_r1.value() > 0 ? 0 : -1);
  }
}

const _c0 = function (a0) {
  return {
    alias: a0
  };
};
…
function MyApp_Template(rf, ctx) {
  if (rf & 1) {
    $r3$.ɵɵtemplate(0, MyApp_Conditional_0_Template, 1, 0);
    $r3$.ɵɵtemplate(1, MyApp_Conditional_1_Template, 1, 1);
  }
  if (rf & 2) {
    let MyApp_contFlowTmp;
    $r3$.ɵɵconditional(0, ctx.value() === 2 ? 0 : (MyApp_contFlowTmp = $r3$.ɵɵpureFunction1(2, _c0, ctx.value())).alias ? 1 : -1, MyApp_contFlowTmp);
  }
}
