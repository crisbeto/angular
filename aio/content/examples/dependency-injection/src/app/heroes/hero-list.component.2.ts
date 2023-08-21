// #docplaster
// #docregion
import { Component } from '@angular/core';
import { Hero } from './hero';
// #enddocregion
import { HeroService } from './hero.service.1';
import { NgFor } from '@angular/common';
/*
// #docregion
import { HeroService } from './hero.service';
// #enddocregion
*/
// #docregion

@Component({
    selector: 'app-hero-list',
    template: `
    <div *ngFor="let hero of heroes">
      {{hero.id}} - {{hero.name}}
    </div>
  `,
    standalone: true,
    imports: [NgFor]
})
export class HeroListComponent {
  heroes: Hero[];

  constructor(heroService: HeroService) {
    this.heroes = heroService.getHeroes();
  }
}
