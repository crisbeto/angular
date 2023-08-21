import { Component } from '@angular/core';

import { Hero } from '../shared/hero.model';
import { HeroComponent } from '../hero/hero.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'toh-hero-list',
    template: `
    <section>
      Our list of heroes:
      <toh-hero *ngFor="let hero of heroes">
      </toh-hero>
      Total powers: {{totalPowers}}<br>
      Average power: {{avgPower}}
    </section>
  `,
    standalone: true,
    imports: [NgFor, HeroComponent]
})
export class HeroListComponent {
  heroes: Hero[] = [];
  totalPowers = 1;

  get avgPower() {
    return this.totalPowers / this.heroes.length;
  }
}
