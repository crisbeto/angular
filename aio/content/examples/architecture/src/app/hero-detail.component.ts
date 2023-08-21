import { Component, Input } from '@angular/core';

import { Hero } from './hero';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-hero-detail',
    templateUrl: './hero-detail.component.html',
    standalone: true,
    imports: [FormsModule]
})
export class HeroDetailComponent {
  @Input() hero!: Hero;
}
