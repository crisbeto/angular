import { Component, ViewEncapsulation } from '@angular/core';
import { NoEncapsulationComponent } from './no-encapsulation.component';

// #docregion
@Component({
    selector: 'app-emulated-encapsulation',
    template: `
    <h2>Emulated</h2>
    <div class="emulated-message">Emulated encapsulation</div>
    <app-no-encapsulation></app-no-encapsulation>
  `,
    styles: ['h2, .emulated-message { color: green; }'],
    encapsulation: ViewEncapsulation.Emulated,
    standalone: true,
    imports: [NoEncapsulationComponent],
})
export class EmulatedEncapsulationComponent { }
