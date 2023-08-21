import { Component } from '@angular/core';
import { UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-precedence',
    templateUrl: './precedence.component.html',
    standalone: true,
    imports: [UpperCasePipe]
})

export class PrecedenceComponent {
  title = 'Pipes and Precedence';
}
