// #docplaster
// #docregion directive


import { Directive } from '@angular/core';

@Directive({
    selector: '[appItem]',
    standalone: true
})
export class ItemDirective {
// code goes here
  constructor() { }

}
// #enddocregion directive
