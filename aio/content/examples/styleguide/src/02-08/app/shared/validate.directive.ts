// #docregion
import { Directive } from '@angular/core';

// #docregion example
@Directive({
    selector: '[tohValidate]',
    standalone: true
})
export class ValidateDirective {}
// #enddocregion example
