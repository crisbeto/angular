import { Component, Inject } from '@angular/core';

import { APP_CONFIG, AppConfig } from './app.config';
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
  title: string;

  // #docregion ctor
  constructor(@Inject(APP_CONFIG) config: AppConfig) {
    this.title = config.title;
  }
  // #enddocregion ctor
}
