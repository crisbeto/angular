import { Component, OnInit } from '@angular/core';

import { Hero } from './hero';
import { HeroService } from './hero.service';
import { HeroDetailComponent } from './hero-detail.component';
import { NgFor, NgIf } from '@angular/common';

// #docregion metadata, providers
@Component({
    selector: 'app-hero-list',
    templateUrl: './hero-list.component.html',
    providers: [HeroService],
    standalone: true,
    imports: [NgFor, NgIf, HeroDetailComponent]
})
// #enddocregion providers
// #docregion class
export class HeroListComponent implements OnInit {
  // #enddocregion metadata
  heroes: Hero[] = [];
  selectedHero: Hero | undefined;

  // #docregion ctor
  constructor(private service: HeroService) { }
  // #enddocregion ctor

  ngOnInit() {
    this.heroes = this.service.getHeroes();
  }

  selectHero(hero: Hero) { this.selectedHero = hero; }
  // #docregion metadata
}
