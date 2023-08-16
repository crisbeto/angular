function MyApp_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    $r3$.ɵɵtext(0, "hello");
  }
}

function MyApp_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    $r3$.ɵɵtext(0, "goodbye");
  }
}

function MyApp_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    $r3$.ɵɵtext(0, "goodbye again");
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
    $r3$.ɵɵelementStart(0, "div");
    $r3$.ɵɵtext(1);
    $r3$.ɵɵtemplate(2, MyApp_Conditional_2_Template, 1, 0);
    $r3$.ɵɵtemplate(3, MyApp_Conditional_3_Template, 1, 0);
    $r3$.ɵɵtemplate(4, MyApp_Conditional_4_Template, 1, 0);
    $r3$.ɵɵelementEnd();
  }
  if (rf & 2) {
    let MyApp_contFlowTmp;
    $r3$.ɵɵadvance(1);
    $r3$.ɵɵtextInterpolate1(" ", ctx.message, " ");
    $r3$.ɵɵadvance(1);
    $r3$.ɵɵconditional(2, (MyApp_contFlowTmp = $r3$.ɵɵpureFunction1(3, _c0, ctx.value() === 1)).alias ? 2 : (MyApp_contFlowTmp = undefined) || ctx.value() === 2 ? 3 : 4, MyApp_contFlowTmp);
  }
}
