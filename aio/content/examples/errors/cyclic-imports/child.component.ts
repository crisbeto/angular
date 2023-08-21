import { Component } from '@angular/core';
import { ParentComponent } from './parent.component';

@Component({
    selector: 'app-child', template: 'The child!',
    standalone: true
})
export class ChildComponent {
  constructor(private parent: ParentComponent) {}
}
