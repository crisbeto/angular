/* eslint-disable @angular-eslint/directive-selector */
// #docregion
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[adHost]',
    standalone: true,
})
export class AdDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

