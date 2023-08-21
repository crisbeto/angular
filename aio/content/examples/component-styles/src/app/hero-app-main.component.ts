import { Component, Input } from '@angular/core';

import { Hero } from './hero';
import { HeroControlsComponent } from './hero-controls.component';
import { HeroDetailsComponent } from './hero-details.component';
import { QuestSummaryComponent } from './quest-summary.component';

@Component({
    selector: 'app-hero-main',
    template: `
    <app-quest-summary></app-quest-summary>
    <app-hero-details [hero]="hero" [class.active]="hero.active">
      <app-hero-controls [hero]="hero"></app-hero-controls>
    </app-hero-details>
  `,
    standalone: true,
    imports: [QuestSummaryComponent, HeroDetailsComponent, HeroControlsComponent]
})
export class HeroAppMainComponent {
  @Input() hero!: Hero;
}
