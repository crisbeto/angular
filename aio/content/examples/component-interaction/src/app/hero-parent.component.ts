// #docregion
import { Component } from '@angular/core';

import { HEROES } from './hero';
import { HeroChildComponent } from './hero-child.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-hero-parent',
    template: `
    <h2>{{master}} controls {{heroes.length}} heroes</h2>

    <app-hero-child
      *ngFor="let hero of heroes"
      [hero]="hero"
      [master]="master">
    </app-hero-child>
  `,
    standalone: true,
    imports: [NgFor, HeroChildComponent]
})
export class HeroParentComponent {
  heroes = HEROES;
  master = 'Master';
}
// #enddocregion
