// #docregion
import { Component } from '@angular/core';
import { NameChildComponent } from './name-child.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-name-parent',
    template: `
    <h2>Master controls {{names.length}} names</h2>

    <app-name-child *ngFor="let name of names" [name]="name"></app-name-child>
  `,
    standalone: true,
    imports: [NgFor, NameChildComponent]
})
export class NameParentComponent {
  // Displays 'Dr. IQ', '<no name set>', 'Bombasto'
  names = ['Dr. IQ', '   ', '  Bombasto  '];
}
// #enddocregion
