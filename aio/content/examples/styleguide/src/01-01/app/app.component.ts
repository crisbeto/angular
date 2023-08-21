// #docregion
import { Component } from '@angular/core';

import { HeroService } from './heroes';
import { HeroesComponent } from './heroes/heroes.component';

@Component({
    selector: 'toh-app',
    template: `
      <toh-heroes></toh-heroes>
    `,
    styleUrls: ['./app.component.css'],
    providers: [HeroService],
    standalone: true,
    imports: [HeroesComponent]
})
export class AppComponent {}
