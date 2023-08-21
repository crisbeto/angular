import { Component } from '@angular/core';
import { Hero } from '../hero';
// #docregion import-heroes
import { HEROES } from '../mock-heroes';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
// #enddocregion import-heroes

// #docplaster
// #docregion metadata
@Component({
    selector: 'app-heroes',
    templateUrl: './heroes.component.html',
    styleUrls: ['./heroes.component.css'],
    standalone: true,
    imports: [NgFor, NgIf, FormsModule, UpperCasePipe]
})
// #enddocregion metadata

// #docregion component
export class HeroesComponent {

  heroes = HEROES;
  // #enddocregion component
  // #docregion on-select
  selectedHero?: Hero;
 // #enddocregion on-select

  // #docregion on-select
  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
  // #enddocregion on-select
// #docregion component
}
// #enddocregion component
