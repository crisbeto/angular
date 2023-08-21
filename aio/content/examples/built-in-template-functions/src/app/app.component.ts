import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true
})
export class AppComponent {
  title = 'Built-in Template Functions';

  item = {
    name : 'Telephone',
    origin : 'Sweden',
    price: 98
  };
}
