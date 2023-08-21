import { Component, ViewChild } from '@angular/core';

import { DoCheckComponent } from './do-check.component';
import { Hero } from './hero';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'do-check-parent',
    templateUrl: './do-check-parent.component.html',
    standalone: true,
    imports: [FormsModule, DoCheckComponent]
})
export class DoCheckParentComponent {
  hero!: Hero;
  power = '';
  title = 'DoCheck';
  @ViewChild(DoCheckComponent) childView!: DoCheckComponent;

  constructor() {
    this.reset();
  }

  reset() {
    this.hero = new Hero('Windstorm');
    this.power = 'sing';
    if (this.childView) {
      this.childView.reset();
    }
  }
}
