import { Component, HostBinding } from '@angular/core';
import { Hero } from './hero';
import { HeroAppMainComponent } from './hero-app-main.component';

// #docregion
@Component({
    selector: 'app-root',
    template: `
    <h1>Tour of Heroes</h1>
    <app-hero-main [hero]="hero"></app-hero-main>
  `,
    styles: ['h1 { font-weight: normal; }'],
    standalone: true,
    imports: [HeroAppMainComponent]
})
export class HeroAppComponent {
// #enddocregion
  hero = new Hero(
    'Human Torch',
    ['Mister Fantastic', 'Invisible Woman', 'Thing']
  );

  @HostBinding('class') get themeClass() {
    return 'theme-light';
  }
// #docregion
}
// #enddocregion
