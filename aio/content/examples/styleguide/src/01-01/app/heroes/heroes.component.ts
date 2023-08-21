// #docregion
import { Component, OnInit } from '@angular/core';

import { Hero, HeroService } from './shared';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'toh-heroes',
    template: `
      <pre>{{heroes | json}}</pre>
    `,
    standalone: true,
    imports: [JsonPipe]
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.heroService.getHeroes()
      .then(heroes => this.heroes = heroes);
  }
}
