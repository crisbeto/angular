import { Component } from '@angular/core';
import { HeroButtonComponent } from './heroes/shared/hero-button/hero-button.component';

@Component({
    selector: 'sg-app',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [HeroButtonComponent]
})
export class AppComponent { }
