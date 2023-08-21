import { Component } from '@angular/core';
import { HEROES } from './mock-heroes';
import { NgFor } from '@angular/common';

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
  heroes = HEROES;
}
