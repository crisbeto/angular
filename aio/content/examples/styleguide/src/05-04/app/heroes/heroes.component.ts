import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Hero, HeroService } from './shared';
import { NgFor, NgIf, AsyncPipe, UpperCasePipe } from '@angular/common';

// #docregion example
@Component({
    selector: 'toh-heroes',
    templateUrl: './heroes.component.html',
    styleUrls: ['./heroes.component.css'],
    standalone: true,
    imports: [NgFor, NgIf, AsyncPipe, UpperCasePipe]
})
export class HeroesComponent {
  heroes: Observable<Hero[]>;
  selectedHero!: Hero;

  constructor(private heroService: HeroService) {
    this.heroes = this.heroService.getHeroes();
  }
}
// #enddocregion example
