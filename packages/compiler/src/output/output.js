function anonymous(jit___defineNgModule_0, jit_DynamicTestModule_1, jit_App_2, jit_SomeComp_3, jit_TestPipe_4, jit_RootScopeModule_5, jit_ServerTestingModule_6) {
  "use strict";
  'use strict';
  var $def = jit___defineNgModule_0({
    type: jit_DynamicTestModule_1,
    declarations: [jit_App_2,
      jit_SomeComp_3, jit_TestPipe_4
    ],
    imports: [jit_RootScopeModule_5, jit_ServerTestingModule_6]
  });
  return {
    $def: $def
  };
  //# sourceURL=ng:///DynamicTestModule/ngModuleDef.js
}

function anonymous(jit___defineComponent_0, jit_App_1, jit___viewQuery_2, jit_SomeComp_3, jit___queryRefresh_4, jit___loadViewQuery_5, jit___text_6, jit___element_7, jit___pipe_8, jit___textInterpolate1_9, jit___select_10, jit___property_11, jit___pipeBind1_12) {
  "use strict";
  'use strict';
  var _c0 = [3, 'value'];
  var $def = jit___defineComponent_0({
    type: jit_App_1,
    selectors: [
      ['ng-component']
    ],
    factory: function App_Factory(t) {
      return new(t || jit_App_1)();
    },
    viewQuery: function App_Query(rf, ctx) {
      if (rf & 1) {
        jit___viewQuery_2(jit_SomeComp_3, true, null);
      }
      if (rf & 2) {
        var _t;
        (jit___queryRefresh_4((_t = jit___loadViewQuery_5())) && (ctx.comp = _t.first));
      }
    },
    consts: 3,
    vars: 4,
    template: function App_Template(rf, ctx) {
      if (rf & 1) {
        jit___text_6(0);
        jit___element_7(1, 'some-comp', _c0);
        jit___pipe_8(2, 'testPipe');
      }
      if (rf & 2) {
        jit___textInterpolate1_9(' Outer value: "', ctx.displayValue, '" ');
        jit___select_10(1);
        jit___property_11('value', jit___pipeBind1_12(2, 2, ctx.pipeValue));
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
  return {
    $def: $def
  };
  //# sourceURL=ng:///App.js
}

function anonymous(jit___defineComponent_0, jit_SomeComp_1, jit___text_2, jit___textInterpolate1_3) {
  "use strict";
  'use strict';
  var $def = jit___defineComponent_0({
    type: jit_SomeComp_1,
    selectors: [
      ['some-comp']
    ],
    factory: function SomeComp_Factory(t) {
      return new(t || jit_SomeComp_1)();
    },
    inputs: {
      value: 'value'
    },
    consts: 1,
    vars: 1,
    template: function SomeComp_Template(rf,
      ctx) {
      if (rf & 1) {
        jit___text_2(0);
      }
      if (rf & 2) {
        jit___textInterpolate1_3('Inner value: "', ctx.displayValue, '"');
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
  return {
    $def: $def
  };
  //# sourceURL=ng:///SomeComp.js
}

function anonymous(jit___definePipe_0, jit_TestPipe_1, jit___directiveInject_2, jit_ChangeDetectorRef_3) {
  "use strict";
  'use strict';
  var $def = jit___definePipe_0({
    name: 'testPipe',
    type: jit_TestPipe_1,
    factory: function TestPipe_Factory(t) {
      return new(t || jit_TestPipe_1)(jit___directiveInject_2(jit_ChangeDetectorRef_3));
    },
    pure: true
  });
  return {
    $def: $def
  };
  //# sourceURL=ng:///TestPipe/ngPipeDef.js
}
