// #docregion
import { Component, Input } from '@angular/core';

import { Hero } from './hero';

@Component({
    selector: 'happy-hero',
    template: 'Wow. You like {{hero.name}}. What a happy hero ... just like you.',
    standalone: true
})
export class HappyHeroComponent {
  @Input() hero!: Hero;
}

@Component({
    selector: 'sad-hero',
    template: 'You like {{hero.name}}? Such a sad hero. Are you sad too?',
    standalone: true
})
export class SadHeroComponent {
  @Input() hero!: Hero;
}

@Component({
    selector: 'confused-hero',
    template: 'Are you as confused as {{hero.name}}?',
    standalone: true
})
export class ConfusedHeroComponent {
  @Input() hero!: Hero;
}

@Component({
    selector: 'unknown-hero',
    template: '{{message}}',
    standalone: true
})
export class UnknownHeroComponent {
  @Input() hero!: Hero;
  get message() {
    return this.hero && this.hero.name
      ? `${this.hero.name} is strange and mysterious.`
      : 'Are you feeling indecisive?';
  }
}

export const heroComponents = [
  HappyHeroComponent,
  SadHeroComponent,
  ConfusedHeroComponent,
  UnknownHeroComponent
];
