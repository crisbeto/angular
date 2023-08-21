// #docregion
import { Component } from '@angular/core';
import { VoterComponent } from './voter.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-vote-taker',
    template: `
    <h2>Should mankind colonize the Universe?</h2>
    <h3>Agree: {{agreed}}, Disagree: {{disagreed}}</h3>

    <app-voter
      *ngFor="let voter of voters"
      [name]="voter"
      (voted)="onVoted($event)">
    </app-voter>
  `,
    standalone: true,
    imports: [NgFor, VoterComponent]
})
export class VoteTakerComponent {
  agreed = 0;
  disagreed = 0;
  voters = ['Dr. IQ', 'Celeritas', 'Bombasto'];

  onVoted(agreed: boolean) {
    if (agreed) {
      this.agreed++;
    } else {
      this.disagreed++;
    }
  }
}
// #enddocregion
