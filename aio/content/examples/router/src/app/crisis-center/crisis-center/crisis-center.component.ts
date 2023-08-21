// #docregion
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-crisis-center',
    templateUrl: './crisis-center.component.html',
    styleUrls: ['./crisis-center.component.css'],
    standalone: true,
    imports: [RouterOutlet]
})
export class CrisisCenterComponent {}
