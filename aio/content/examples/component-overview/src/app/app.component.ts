import { Component } from '@angular/core';
import { ComponentOverviewComponent } from './component-overview/component-overview.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [ComponentOverviewComponent]
})
export class AppComponent {
  title = 'component-overview';
}
