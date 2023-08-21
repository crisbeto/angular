// #docplaster
// #docregion, v1
import { Component } from '@angular/core';
// #enddocregion v1
import { Hero } from '../hero';
import { UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
// #docregion v1

@Component({
    selector: 'app-heroes',
    templateUrl: './heroes.component.html',
    styleUrls: ['./heroes.component.css'],
    standalone: true,
    imports: [FormsModule, UpperCasePipe]
})
export class HeroesComponent {
  // #enddocregion, v1
  /*
  // #docregion add-hero
  hero = 'Windstorm';
  // #enddocregion add-hero
  */
  // #docregion
  hero: Hero = {
    id: 1,
    name: 'Windstorm'
  };
  // #docregion v1
}
// #enddocregion, v1
