import { Component } from '@angular/core';
import { ChildComponent } from './child.component';

@Component({
    selector: 'app-parent', template: '<app-child></app-child>',
    standalone: true,
    imports: [ChildComponent]
})
export class ParentComponent {}
