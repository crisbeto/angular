import { Component } from '@angular/core';
import { NgIf, UpperCasePipe, LowerCasePipe, JsonPipe, CurrencyPipe, DatePipe } from '@angular/common';


interface Item {
  name: string;
  manufactureDate: Date;
  color?: string | null;
  price: number;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [NgIf, UpperCasePipe, LowerCasePipe, JsonPipe, CurrencyPipe, DatePipe]
})
export class AppComponent {
  title = 'Template Expression Operators';

  item: Item = {
    name : 'Telephone',
    manufactureDate : new Date(1980, 1, 25),
    color: 'orange',
    price: 98,
  };

  nullItem: Item | null = null;

}

