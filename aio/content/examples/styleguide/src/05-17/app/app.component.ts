import { Component } from '@angular/core';
import { HeroListComponent } from './heroes/hero-list/hero-list.component';

@Component({
    selector: 'sg-app',
    template: '<toh-hero-list></toh-hero-list>',
    standalone: true,
    imports: [HeroListComponent]
})
export class AppComponent { }
