/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectionStrategy} from '@angular/compiler';
import {Component, Directive, inject, Inject, InjectionToken, Input, ViewChild} from '@angular/core';
import {TestBed} from '@angular/core/testing';

fdescribe('host directives', () => {
  // Chained use case
  it('chained', () => {
    const token = new InjectionToken('message');

    @Directive({
      host: {'class': 'another-dir'},
      providers: [{provide: token, useValue: 'another-dir value'}]
    })
    class Chain1_3 {
      constructor(@Inject(token) tokenValue: string) {
        console.log('Chain1 - level 3', tokenValue);
      }
    }

    @Directive({hostDirectives: [Chain1_3]})
    class Chain1_2 {
      constructor() {
        console.log('Chain1 - level 2');
      }
    }

    @Directive({hostDirectives: [Chain1_2]})
    class Chain1 {
      constructor() {
        console.log('Chain1 - root');
      }
    }

    @Directive({providers: [{provide: token, useValue: 'component value'}]})
    class Chain2_2 {
      constructor() {
        console.log('Chain2 - level 2');
      }
    }

    @Directive({hostDirectives: [Chain2_2]})
    class Chain2 {
      constructor() {
        console.log('Chain2 - root');
      }
    }

    @Directive()
    class Chain3_2 {
      constructor() {
        console.log('Chain3 - level 2');
      }
    }

    @Directive({hostDirectives: [Chain3_2]})
    class Chain3 {
      constructor() {
        console.log('Chain3 - root');
      }
    }

    @Component({
      selector: 'my-comp',
      host: {'class': 'my-comp'},
      template: '<ng-content></ng-content>',
      hostDirectives: [Chain1, Chain2, Chain3],
    })
    class MyComp {
      constructor() {
        console.log('component');
      }
    }
    @Component({template: '<my-comp></my-comp>'})
    class App {
    }

    TestBed.configureTestingModule({declarations: [App, MyComp]});
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    // Chain1 - level 3 component value
    // Chain1 - level 2
    // Chain1 - root
    // Chain2 - level 2
    // Chain2 - root
    // Chain3 - level 2
    // Chain3 - root
    // component

    console.log(fixture.nativeElement.innerHTML);
  });

  it('a little bit of everything', () => {
    const someToken = new InjectionToken<any>('foo');

    @Directive({standalone: true})
    class ExtraDir {
      @Input()
      set foo(v: any) {
        // TODO: this incorrectly fires twice. It's due to the hacky proof-of-concept code
        // inside `initializeInputAndOutputAliases` which is going to be removed.
        console.log('shadowed directive set', v);
      }

      @Input()
      set directiveOnly(v: any) {
        console.log('directive-only set', v);
      }

      constructor() {
        console.log('host directive created', inject(someToken));
      }
    }

    @Component({
      selector: 'my-comp',
      hostDirectives: [ExtraDir],
      providers: [{provide: someToken, useValue: 'hello'}]
    })
    class MyComp {
      @Input()
      set foo(v: any) {
        console.log('shadowed component set', v);
      }
    }

    @Component({template: '<my-comp [foo]="1" [directiveOnly]="2"></my-comp>'})
    class App {
      @ViewChild(ExtraDir) hostDirInstance!: ExtraDir;
    }

    TestBed.configureTestingModule({declarations: [App, MyComp]});
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    console.log(fixture.componentInstance.hostDirInstance);
  });

  it('', () => {
    @Directive({selector: '[extra]', host: {'[attr.foo]': 'foo'}})
    class ExtraDir {
      @Input() foo = 'default';

      constructor() {
        console.log('directive init');
      }

      ngDoCheck() {
        console.log('directive doCheck');
      }
    }

    @Component({
      selector: 'my-comp',
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class MyComp {
      @Input()
      set fooAlias(value: string) {
        this._fooAlias = value;
        this.dir.foo = this.fooAlias;
      }
      get fooAlias() {
        return this._fooAlias;
      }
      private _fooAlias = '';

      ngOnChanges() {
        this.fooAlias += '-onChanges';
      }

      ngDoCheck() {
        console.log('component doCheck');
      }

      constructor(private dir: ExtraDir) {
        console.log('component init');
      }
    }

    @Component({
      template: `
          <my-comp extra [fooAlias]="foo"></my-comp>
          <button (click)="change()">Change</button>
        `,
      changeDetection: ChangeDetectionStrategy.OnPush
    })
    class App {
      foo = 'initial';

      change() {
        this.foo = 'overwritten-' + this.foo;
      }
    }

    TestBed.configureTestingModule({declarations: [App, MyComp, ExtraDir]});
    const fixture = TestBed.createComponent(App);
    console.log('-----------------------------');
    console.log(fixture.nativeElement.innerHTML);

    fixture.detectChanges();
    console.log('-----------------------------');
    console.log(fixture.nativeElement.innerHTML);

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    console.log('-----------------------------');
    console.log(fixture.nativeElement.innerHTML);

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    console.log('-----------------------------');
    console.log(fixture.nativeElement.innerHTML);
  });

  fit('aliases', () => {
    @Directive({standalone: true})
    class ExtraDir {
      @Input('ownAlias')
      set foo(v: any) {
        console.log('directive set', v);
      }
    }

    @Component({
      selector: 'my-comp',
      hostDirectives: [{directive: ExtraDir, inputs: ['ownAlias: customAlias']}]
    })
    class MyComp {
    }

    @Component({template: '<my-comp [customAlias]="1"></my-comp>'})
    class App {
    }

    TestBed.configureTestingModule({declarations: [App, MyComp]});
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });
});
