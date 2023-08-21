// #docregion
import { Component } from '@angular/core';
import { HeroesComponent } from './heroes/heroes.component';
import { CarComponent } from './car/car.component';

@Component({
    selector: 'app-root',
    template: `
    <h1>{{title}}</h1>
    <app-car></app-car>
    <app-heroes></app-heroes>
  `,
    standalone: true,
    imports: [CarComponent, HeroesComponent]
})

export class AppComponent {
  title = 'Dependency Injection';
}
