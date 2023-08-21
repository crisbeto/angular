import { Component } from '@angular/core';
import { HeroComponent } from './heroes/hero.component';

@Component({
    selector: 'sg-app',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [HeroComponent]
})
export class AppComponent {

  onSavedTheDay(event$: any) { }
}
