import { Component } from '@angular/core';
import { HeroButtonComponent } from './heroes/shared/hero-button/hero-button.component';

@Component({
    selector: 'sg-app',
    template: '<toh-hero-button label="OK"></toh-hero-button>',
    standalone: true,
    imports: [HeroButtonComponent]
})
export class AppComponent { }
