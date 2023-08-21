import { Component, Input } from '@angular/core';
import { Hero } from './hero';
import { HeroTeamComponent } from './hero-team.component';

@Component({
    selector: 'app-hero-details',
    template: `
    <h2>{{hero.name}}</h2>
    <app-hero-team [hero]=hero></app-hero-team>
    <ng-content></ng-content>
  `,
    styleUrls: ['./hero-details.component.css'],
    standalone: true,
    imports: [HeroTeamComponent]
})
export class HeroDetailsComponent {
  @Input() hero!: Hero;
}
