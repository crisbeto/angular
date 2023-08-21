// #docregion
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-hero-birthday2',
    // #docregion template
    template: `
    <p>The hero's birthday is {{ birthday | date:format }}</p>
    <button type="button" (click)="toggleFormat()">Toggle Format</button>
  `
    // #enddocregion template
    ,
    standalone: true,
    imports: [DatePipe]
})
// #docregion class
export class HeroBirthday2Component {
  birthday = new Date(1988, 3, 15); // April 15, 1988 -- since month parameter is zero-based
  toggle = true; // start with true == shortDate

  get format()   { return this.toggle ? 'shortDate' : 'fullDate'; }
  toggleFormat() { this.toggle = !this.toggle; }
}
