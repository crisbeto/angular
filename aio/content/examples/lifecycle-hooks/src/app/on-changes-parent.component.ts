import { Component, ViewChild } from '@angular/core';

import { Hero } from './hero';
import { OnChangesComponent } from './on-changes.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'on-changes-parent',
    templateUrl: './on-changes-parent.component.html',
    styles: [''],
    standalone: true,
    imports: [FormsModule, OnChangesComponent]
})
export class OnChangesParentComponent {
  hero!: Hero;
  power = '';
  title = 'OnChanges';
  @ViewChild(OnChangesComponent) childView!: OnChangesComponent;

  constructor() {
    this.reset();
  }

  reset() {
    // new Hero object every time; triggers onChanges
    this.hero = new Hero('Windstorm');
    // setting power only triggers onChanges if this value is different
    this.power = 'sing';
    if (this.childView) {
      this.childView.reset();
    }
  }
}
