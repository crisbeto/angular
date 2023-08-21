// #docregion
import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: '[tohValidator]',
    standalone: true
})
export class ValidatorDirective {
  @HostBinding('attr.role') role = 'button';
  @HostListener('mouseenter') onMouseEnter() {
    // do work
  }
}
