// #docregion
import { Directive, HostListener } from '@angular/core';

// #docregion example
@Directive({
    selector: '[tohHighlight]',
    standalone: true
})
export class HighlightDirective {
  @HostListener('mouseover') onMouseEnter() {
    // do highlight work
  }
}
// #enddocregion example
