import { Component } from '@angular/core';

import { products } from '../products';
import { ProductAlertsComponent } from '../product-alerts/product-alerts.component';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
    standalone: true,
    imports: [NgFor, RouterLink, NgIf, ProductAlertsComponent]
})
// #docregion on-notify
export class ProductListComponent {

  products = [...products];

  share() {
    window.alert('The product has been shared!');
  }

  onNotify() {
    window.alert('You will be notified when the product goes on sale');
  }
}
