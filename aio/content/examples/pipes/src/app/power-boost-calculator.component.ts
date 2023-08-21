// #docregion
import { Component } from '@angular/core';
import { ExponentialStrengthPipe } from './exponential-strength.pipe';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-power-boost-calculator',
    template: `
    <h2>Power Boost Calculator</h2>
    <label for="power-input">Normal power: </label>
    <input id="power-input" type="text" [(ngModel)]="power">
    <label for="boost-input">Boost factor: </label>
    <input id="boost-input" type="text" [(ngModel)]="factor">
    <p>
      Super Hero Power: {{power | exponentialStrength: factor}}
    </p>
  `,
    styles: ['input {margin: .5rem 0;}'],
    standalone: true,
    imports: [FormsModule, ExponentialStrengthPipe]
})
export class PowerBoostCalculatorComponent {
  power = 5;
  factor = 1;
}
