import { Component } from '@angular/core';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { NgClass } from '@angular/common';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [NgClass, ItemDetailComponent, ItemListComponent]
})
export class AppComponent {
  // #docregion item-image
  itemImageUrl = '../assets/phone.svg';
  // #enddocregion item-image
  // #docregion boolean
  isUnchanged = true;
  // #enddocregion boolean
  classes = 'special';
  // #docregion parent-data-type
  parentItem = 'lamp';
  // #enddocregion parent-data-type

  // #docregion pass-object
  currentItems = [{
    id: 21,
    name: 'phone'
  }];
  // #enddocregion pass-object

  interpolationTitle = 'Interpolation';
  propertyTitle = 'Property binding';

  evilTitle = 'Template <script>alert("evil never sleeps")</script> Syntax';
}
