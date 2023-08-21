import { Component } from '@angular/core';
import { ValidateDirective } from './shared/validate.directive';
import { InputHighlightDirective } from './shared/input-highlight.directive';

@Component({
    selector: 'sg-app',
    template: '<input type="text" tohValidate>',
    standalone: true,
    imports: [InputHighlightDirective, ValidateDirective]
})
export class AppComponent { }
