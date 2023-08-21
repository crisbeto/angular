// #docregion
import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

// #docregion little-tour
@Component({
    selector: 'app-little-tour',
    template: `
    <input #newHero
      (keyup.enter)="addHero(newHero.value)"
      (blur)="addHero(newHero.value); newHero.value='' ">

    <button type="button" (click)="addHero(newHero.value)">Add</button>

    <ul><li *ngFor="let hero of heroes">{{hero}}</li></ul>
  `,
    standalone: true,
    imports: [NgFor]
})
export class LittleTourComponent {
  heroes = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado'];
  addHero(newHero: string) {
    if (newHero) {
      this.heroes.push(newHero);
    }
  }
}
// #enddocregion little-tour
