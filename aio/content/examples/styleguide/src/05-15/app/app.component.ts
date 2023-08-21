import { Component } from '@angular/core';

import { HeroService } from './heroes';
import { HeroListComponent } from './heroes/hero-list/hero-list.component';

@Component({
    selector: 'sg-app',
    template: '<toh-hero-list></toh-hero-list>',
    providers: [HeroService],
    standalone: true,
    imports: [HeroListComponent]
})
export class AppComponent { }
