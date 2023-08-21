import { Component, OnInit } from '@angular/core';

import { Hero, HeroService } from './heroes';
import { NgFor } from '@angular/common';

@Component({
    selector: 'sg-app',
    templateUrl: './app.component.html',
    providers: [HeroService],
    standalone: true,
    imports: [NgFor]
})
export class AppComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }
}
