/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


import {ɵsetEnabledBlockTypes as setEnabledBlockTypes} from '@angular/compiler/src/jit_compiler_facade';
import {Component, Pipe, PipeTransform} from '@angular/core';
import {TestBed} from '@angular/core/testing';

describe('control flow', () => {
  describe('if', () => {
    beforeEach(() => setEnabledBlockTypes(['if']));
    afterEach(() => setEnabledBlockTypes([]));

    it('should add and remove views based on conditions change', () => {
      @Component({standalone: true, template: '{#if show}Something{:else}Nothing{/if}'})
      class TestComponent {
        show = true;
      }

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toBe('Something');

      fixture.componentInstance.show = false;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('Nothing');
    });

    it('should expose expression value in context', () => {
      @Component({
        standalone: true,
        template: '{#if show; as alias}{{show}} aliased to {{alias}}{/if}',
      })
      class TestComponent {
        show: any = true;
      }

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('true aliased to true');

      fixture.componentInstance.show = 1;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('1 aliased to 1');
    });

    it('should expose the context to nested conditional blocks', () => {
      @Component({
        standalone: true,
        template: `
          {#if show === 2}
            {:else if show; as alias}
              {#if show > 0}
                {#if show !== 7}{{alias}}{/if}
              {/if}
          {/if}
        `,
      })
      class TestComponent {
        show = 1;
      }

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('1');

      fixture.componentInstance.show = 3;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('3');
    });

    it('should expose expression value in context', () => {
      @Component({
        standalone: true,
        template: '{#if show; as alias}{{show}} aliased to {{alias}}{/if}',
      })
      class TestComponent {
        show: any = true;
      }

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('true aliased to true');

      fixture.componentInstance.show = 1;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('1 aliased to 1');
    });

    it('should expose expression value passed through a pipe in context', () => {
      @Pipe({name: 'multiply', pure: true, standalone: true})
      class MultiplyPipe implements PipeTransform {
        transform(value: number, amount: number) {
          return value * amount;
        }
      }

      @Component({
        standalone: true,
        template: '{#if value | multiply:2; as alias}{{value}} aliased to {{alias}}{/if}',
        imports: [MultiplyPipe],
      })
      class TestComponent {
        value = 1;
      }

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('1 aliased to 2');

      fixture.componentInstance.value = 4;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('4 aliased to 8');
    });

    // QUESTION: fundamental mismatch between the "template" and "container" concepts
    // those 2 calls to the ɵɵtemplate instruction will generate comment nodes and LContainer
    it('should destroy all views if there is nothing to display', () => {
      @Component({
        standalone: true,
        template: '{#if show}Something{/if}',
      })
      class TestComponent {
        show = true;
      }

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('Something');

      fixture.componentInstance.show = false;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('');
    });
  });

  describe('switch', () => {
    beforeEach(() => setEnabledBlockTypes(['switch']));
    afterEach(() => setEnabledBlockTypes([]));

    // Open question: == vs. === for comparison
    // == is the current Angular implementation
    // === is used by JavaScript semantics
    it('should show a template based on a matching case', () => {
      @Component({
        standalone: true,
        template: `
          {#switch case}
            {:case 0}case 0
            {:case 1}case 1
            {:default}default
          {/switch}
        `
      })
      class TestComponent {
        case = 0;
      }

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toBe('case 0 ');

      fixture.componentInstance.case = 1;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('case 1 ');

      fixture.componentInstance.case = 5;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBe('default ');
    });
  });
});
