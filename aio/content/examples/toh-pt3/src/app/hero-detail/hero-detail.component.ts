// #docregion
// #docregion import-input
import { Component, Input } from '@angular/core';
// #enddocregion import-input
// #docregion import-hero
import { Hero } from '../hero';
import { FormsModule } from '@angular/forms';
import { NgIf, UpperCasePipe } from '@angular/common';
// #enddocregion import-hero

@Component({
    selector: 'app-hero-detail',
    templateUrl: './hero-detail.component.html',
    styleUrls: ['./hero-detail.component.css'],
    standalone: true,
    imports: [NgIf, FormsModule, UpperCasePipe]
})
export class HeroDetailComponent {
  // #docregion input-hero
  @Input() hero?: Hero;
  // #enddocregion input-hero
}
