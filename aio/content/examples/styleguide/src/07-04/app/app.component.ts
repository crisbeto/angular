// #docregion
import { Component, OnInit } from '@angular/core';

import { HeroArena, HeroService, Hero } from './heroes';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'toh-app',
    template: '<pre>{{heroes | json}}</pre>',
    providers: [HeroArena, HeroService],
    standalone: true,
    imports: [JsonPipe]
})
export class AppComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroArena: HeroArena) { }

  ngOnInit() {
    this.heroArena.getParticipants().subscribe(heroes => this.heroes = heroes);
  }
}
