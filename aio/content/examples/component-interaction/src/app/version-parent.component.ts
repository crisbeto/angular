// #docregion
import { Component } from '@angular/core';
import { VersionChildComponent } from './version-child.component';

@Component({
    selector: 'app-version-parent',
    template: `
    <h2>Source code version</h2>
    <button type="button" (click)="newMinor()">New minor version</button>
    <button type="button" (click)="newMajor()">New major version</button>
    <app-version-child [major]="major" [minor]="minor"></app-version-child>
  `,
    standalone: true,
    imports: [VersionChildComponent]
})
export class VersionParentComponent {
  major = 1;
  minor = 23;

  newMinor() {
    this.minor++;
  }

  newMajor() {
    this.major++;
    this.minor = 0;
  }
}
// #enddocregion
