import { Component } from '@angular/core';
import { HeroesComponent } from './heroes/heroes.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [HeroesComponent]
})
export class AppComponent {
  title = 'Tour of Heroes';
}
