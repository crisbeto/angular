// #docregion
import { Component } from '@angular/core';
import { FetchJsonPipe } from './fetch-json.pipe';
import { NgFor, JsonPipe } from '@angular/common';

@Component({
    selector: 'app-hero-list',
    template: `
    <h2>Heroes from JSON File</h2>

    <div *ngFor="let hero of ('assets/heroes.json' | fetch) ">
      {{hero.name}}
    </div>

    <p>Heroes as JSON:
      {{'assets/heroes.json' | fetch | json}}
    </p>`,
    standalone: true,
    imports: [NgFor, JsonPipe, FetchJsonPipe]
})
export class HeroListComponent { }
