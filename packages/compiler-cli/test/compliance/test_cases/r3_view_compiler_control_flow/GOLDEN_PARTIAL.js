/****************************************************************************************************
 * PARTIAL FILE: basic_switch.js
 ****************************************************************************************************/
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class MyApp {
    constructor() {
        this.message = 'hello';
    }
    value() {
        return 1;
    }
}
MyApp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, deps: [], target: i0.ɵɵFactoryTarget.Component });
MyApp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: MyApp, selector: "ng-component", ngImport: i0, template: `
    <div>
      {{message}}
      {#switch value()}
        {:case 0} case 0
        {:case 1} case 1
        {:case 2} case 2
        {:default} default
      {/switch}
    </div>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, decorators: [{
            type: Component,
            args: [{
                    template: `
    <div>
      {{message}}
      {#switch value()}
        {:case 0} case 0
        {:case 1} case 1
        {:case 2} case 2
        {:default} default
      {/switch}
    </div>
  `,
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: basic_switch.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyApp {
    message: string;
    value(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyApp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyApp, "ng-component", never, {}, {}, never, never, false, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: switch_without_default.js
 ****************************************************************************************************/
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class MyApp {
    constructor() {
        this.message = 'hello';
        this.value = () => 1;
    }
}
MyApp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, deps: [], target: i0.ɵɵFactoryTarget.Component });
MyApp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: MyApp, selector: "ng-component", ngImport: i0, template: `
    <div>
      {{message}}
      {#switch value()}
        {:case 0} case 0
        {:case 1} case 1
        {:case 2} case 2
      {/switch}
    </div>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, decorators: [{
            type: Component,
            args: [{
                    template: `
    <div>
      {{message}}
      {#switch value()}
        {:case 0} case 0
        {:case 1} case 1
        {:case 2} case 2
      {/switch}
    </div>
  `,
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: switch_without_default.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyApp {
    message: string;
    value: () => number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyApp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyApp, "ng-component", never, {}, {}, never, never, false, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: nested_switch.js
 ****************************************************************************************************/
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class MyApp {
    constructor() {
        this.message = 'hello';
        this.value = () => 1;
        this.nestedValue = () => 2;
    }
}
MyApp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, deps: [], target: i0.ɵɵFactoryTarget.Component });
MyApp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: MyApp, selector: "ng-component", ngImport: i0, template: `
    <div>
      {{message}}
      {#switch value()}
        {:case 0} case 0
        {:case 1}
          {#switch nestedValue()}
            {:case 0} nested case 0
            {:case 1} nested case 1
            {:case 2} nested case 2
          {/switch}
        {:case 2} case 2
      {/switch}
    </div>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, decorators: [{
            type: Component,
            args: [{
                    template: `
    <div>
      {{message}}
      {#switch value()}
        {:case 0} case 0
        {:case 1}
          {#switch nestedValue()}
            {:case 0} nested case 0
            {:case 1} nested case 1
            {:case 2} nested case 2
          {/switch}
        {:case 2} case 2
      {/switch}
    </div>
  `,
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: nested_switch.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyApp {
    message: string;
    value: () => number;
    nestedValue: () => number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyApp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyApp, "ng-component", never, {}, {}, never, never, false, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: switch_with_pipe.js
 ****************************************************************************************************/
import { Component, Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class TestPipe {
    tranform(value) {
        return value;
    }
}
TestPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: TestPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
TestPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: TestPipe, isStandalone: true, name: "test" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: TestPipe, decorators: [{
            type: Pipe,
            args: [{ standalone: true, name: 'test' }]
        }] });
export class MyApp {
    constructor() {
        this.message = 'hello';
        this.value = () => 1;
    }
}
MyApp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, deps: [], target: i0.ɵɵFactoryTarget.Component });
MyApp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: MyApp, isStandalone: true, selector: "ng-component", ngImport: i0, template: `
    <div>
      {{message}}
      {#switch value() | test}
        {:case 0} case 0
        {:case 1} case 1
        {:default} default
      {/switch}
    </div>
  `, isInline: true, dependencies: [{ kind: "pipe", type: TestPipe, name: "test" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, decorators: [{
            type: Component,
            args: [{
                    template: `
    <div>
      {{message}}
      {#switch value() | test}
        {:case 0} case 0
        {:case 1} case 1
        {:default} default
      {/switch}
    </div>
  `,
                    standalone: true,
                    imports: [TestPipe]
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: switch_with_pipe.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class TestPipe {
    tranform(value: unknown): unknown;
    static ɵfac: i0.ɵɵFactoryDeclaration<TestPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<TestPipe, "test", true>;
}
export declare class MyApp {
    message: string;
    value: () => number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyApp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyApp, "ng-component", never, {}, {}, never, never, true, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: basic_if.js
 ****************************************************************************************************/
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class MyApp {
    constructor() {
        this.message = 'hello';
        this.value = () => 1;
    }
}
MyApp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, deps: [], target: i0.ɵɵFactoryTarget.Component });
MyApp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: MyApp, selector: "ng-component", ngImport: i0, template: `
    <div>
      {{message}}
      {#if value()}hello{/if}
    </div>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, decorators: [{
            type: Component,
            args: [{
                    template: `
    <div>
      {{message}}
      {#if value()}hello{/if}
    </div>
  `,
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: basic_if.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyApp {
    message: string;
    value: () => number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyApp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyApp, "ng-component", never, {}, {}, never, never, false, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: basic_if_else.js
 ****************************************************************************************************/
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class MyApp {
    constructor() {
        this.message = 'hello';
        this.value = () => 1;
    }
}
MyApp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, deps: [], target: i0.ɵɵFactoryTarget.Component });
MyApp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: MyApp, selector: "ng-component", ngImport: i0, template: `
    <div>
      {{message}}
      {#if value()}hello{:else}goodbye{/if}
    </div>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, decorators: [{
            type: Component,
            args: [{
                    template: `
    <div>
      {{message}}
      {#if value()}hello{:else}goodbye{/if}
    </div>
  `,
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: basic_if_else.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyApp {
    message: string;
    value: () => number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyApp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyApp, "ng-component", never, {}, {}, never, never, false, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: basic_if_else_if.js
 ****************************************************************************************************/
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class MyApp {
    constructor() {
        this.message = 'hello';
        this.value = () => 1;
        this.otherValue = () => 2;
    }
}
MyApp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, deps: [], target: i0.ɵɵFactoryTarget.Component });
MyApp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: MyApp, selector: "ng-component", ngImport: i0, template: `
    <div>
      {{message}}
      {#if value() === 1}
        one
        {:else if otherValue() === 2} two
        {:else if message} three
        {:else} four
      {/if}
    </div>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, decorators: [{
            type: Component,
            args: [{
                    template: `
    <div>
      {{message}}
      {#if value() === 1}
        one
        {:else if otherValue() === 2} two
        {:else if message} three
        {:else} four
      {/if}
    </div>
  `,
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: basic_if_else_if.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyApp {
    message: string;
    value: () => number;
    otherValue: () => number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyApp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyApp, "ng-component", never, {}, {}, never, never, false, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: nested_if.js
 ****************************************************************************************************/
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class MyApp {
    constructor() {
        this.message = 'hello';
        this.val = 1;
        this.innerVal = 2;
    }
}
MyApp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, deps: [], target: i0.ɵɵFactoryTarget.Component });
MyApp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: MyApp, selector: "ng-component", ngImport: i0, template: `
    <div>
      {{message}}
      {#if val === 0}
        zero
        {:else if val === 1} one
        {:else if val === 2}
          {#if innerVal === 0}
            inner zero
            {:else if innerVal === 1} inner one
            {:else if innerVal === 2} inner two
            {:else} inner three
          {/if}
        {:else} inner three
      {/if}
    </div>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, decorators: [{
            type: Component,
            args: [{
                    template: `
    <div>
      {{message}}
      {#if val === 0}
        zero
        {:else if val === 1} one
        {:else if val === 2}
          {#if innerVal === 0}
            inner zero
            {:else if innerVal === 1} inner one
            {:else if innerVal === 2} inner two
            {:else} inner three
          {/if}
        {:else} inner three
      {/if}
    </div>
  `,
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: nested_if.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyApp {
    message: string;
    val: number;
    innerVal: number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyApp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyApp, "ng-component", never, {}, {}, never, never, false, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: if_with_pipe.js
 ****************************************************************************************************/
import { Component, Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class TestPipe {
    tranform(value) {
        return value;
    }
}
TestPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: TestPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
TestPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: TestPipe, isStandalone: true, name: "test" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: TestPipe, decorators: [{
            type: Pipe,
            args: [{ standalone: true, name: 'test' }]
        }] });
export class MyApp {
    constructor() {
        this.message = 'hello';
        this.val = 1;
    }
}
MyApp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, deps: [], target: i0.ɵɵFactoryTarget.Component });
MyApp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: MyApp, selector: "ng-component", ngImport: i0, template: `
    <div>
      {{message}}
      {#if (val | test) === 1}
        one
        {:else if (val | test) === 2} two
        {:else} three
      {/if}
    </div>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, decorators: [{
            type: Component,
            args: [{
                    template: `
    <div>
      {{message}}
      {#if (val | test) === 1}
        one
        {:else if (val | test) === 2} two
        {:else} three
      {/if}
    </div>
  `,
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: if_with_pipe.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class TestPipe {
    tranform(value: unknown): unknown;
    static ɵfac: i0.ɵɵFactoryDeclaration<TestPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<TestPipe, "test", true>;
}
export declare class MyApp {
    message: string;
    val: number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyApp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyApp, "ng-component", never, {}, {}, never, never, false, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: if_else_with_context.js
 ****************************************************************************************************/
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class MyApp {
    constructor() {
        this.message = 'hello';
        this.value = () => 1;
    }
}
MyApp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, deps: [], target: i0.ɵɵFactoryTarget.Component });
MyApp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: MyApp, selector: "ng-component", ngImport: i0, template: `
    <div>
      {{message}}
      {#if value(); as alias}hello{:else}goodbye{/if}
    </div>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, decorators: [{
            type: Component,
            args: [{
                    template: `
    <div>
      {{message}}
      {#if value(); as alias}hello{:else}goodbye{/if}
    </div>
  `,
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: if_else_with_context.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyApp {
    message: string;
    value: () => number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyApp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyApp, "ng-component", never, {}, {}, never, never, false, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: if_else_if_with_top_level_context.js
 ****************************************************************************************************/
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class MyApp {
    constructor() {
        this.message = 'hello';
        this.value = () => 1;
    }
}
MyApp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, deps: [], target: i0.ɵɵFactoryTarget.Component });
MyApp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: MyApp, selector: "ng-component", ngImport: i0, template: `
    <div>
      {{message}}
      {#if value() === 1; as alias}hello{:else if value() === 2}goodbye{:else}goodbye again{/if}
    </div>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, decorators: [{
            type: Component,
            args: [{
                    template: `
    <div>
      {{message}}
      {#if value() === 1; as alias}hello{:else if value() === 2}goodbye{:else}goodbye again{/if}
    </div>
  `,
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: if_else_if_with_top_level_context.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyApp {
    message: string;
    value: () => number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyApp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyApp, "ng-component", never, {}, {}, never, never, false, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: if_context_reset.js
 ****************************************************************************************************/
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class MyApp {
    constructor() {
        this.expr1 = true;
        this.expr2 = true;
        this.expr3 = true;
        this.expr4 = true;
        this.expr5 = true;
    }
}
MyApp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, deps: [], target: i0.ɵɵFactoryTarget.Component });
MyApp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: MyApp, selector: "ng-component", ngImport: i0, template: `
    {#if expr1; as expr1Alias}
      expr1
      {:else if expr2} expr2
      {:else if expr3; as expr3Alias} expr3
      {:else if expr4} expr4
      {:else if expr5} expr5
      {:else} end
    {/if}
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, decorators: [{
            type: Component,
            args: [{
                    template: `
    {#if expr1; as expr1Alias}
      expr1
      {:else if expr2} expr2
      {:else if expr3; as expr3Alias} expr3
      {:else if expr4} expr4
      {:else if expr5} expr5
      {:else} end
    {/if}
  `,
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: if_context_reset.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyApp {
    expr1: boolean;
    expr2: boolean;
    expr3: boolean;
    expr4: boolean;
    expr5: boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyApp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyApp, "ng-component", never, {}, {}, never, never, false, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: if_nested_context.js
 ****************************************************************************************************/
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class MyApp {
    constructor() {
        this.value = () => 1;
    }
}
MyApp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, deps: [], target: i0.ɵɵFactoryTarget.Component });
MyApp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: MyApp, selector: "ng-component", ngImport: i0, template: `
    {#if value() === 2}
      top level
      {:else if value(); as alias}
        {#if value() > 0}
          {#if value() !== 7}{{alias}}{/if}
        {/if}
    {/if}
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: MyApp, decorators: [{
            type: Component,
            args: [{
                    template: `
    {#if value() === 2}
      top level
      {:else if value(); as alias}
        {#if value() > 0}
          {#if value() !== 7}{{alias}}{/if}
        {/if}
    {/if}
  `,
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: if_nested_context.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyApp {
    value: () => number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyApp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MyApp, "ng-component", never, {}, {}, never, never, false, never>;
}

