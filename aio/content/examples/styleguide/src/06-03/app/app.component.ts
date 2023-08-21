import { Component } from '@angular/core';
import { Validator2Directive } from './shared/validator2.directive';
import { ValidatorDirective } from './shared/validator.directive';

@Component({
    selector: 'sg-app',
    template: `
  <input type="text" tohValidator>
  <textarea tohValidator2></textarea>`,
    standalone: true,
    imports: [ValidatorDirective, Validator2Directive]
})
export class AppComponent { }
