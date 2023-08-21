import { Component } from '@angular/core';

import { Hero, heroes } from './hero';
import { TrigonometryDirective } from './trigonometry.directive';
import { HeroComponent } from './hero.component';
import { UnlessDirective } from './unless.directive';
import { HappyHeroComponent, SadHeroComponent, ConfusedHeroComponent, UnknownHeroComponent } from './hero-switch.components';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, NgClass } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [NgIf, NgFor, FormsModule, NgSwitch, NgSwitchCase, HappyHeroComponent, SadHeroComponent, ConfusedHeroComponent, NgSwitchDefault, UnknownHeroComponent, NgClass, UnlessDirective, HeroComponent, TrigonometryDirective]
})
export class AppComponent {
  heroes = heroes;
  hero: Hero | null = this.heroes[0];
  // #docregion condition
  condition = false;
  // #enddocregion condition
  logs: string[] = [];
  showSad = true;
  status = 'ready';

  trackById(index: number, hero: Hero): number { return hero.id; }
}
