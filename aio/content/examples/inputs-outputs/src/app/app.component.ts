
// #docplaster

import { Component } from '@angular/core';
import { AliasingComponent } from './aliasing/aliasing.component';
import { InTheMetadataComponent } from './in-the-metadata/in-the-metadata.component';
import { InputOutputComponent } from './input-output/input-output.component';
import { NgFor } from '@angular/common';
import { ItemOutputComponent } from './item-output/item-output.component';
import { ItemDetailMetadataComponent } from './item-details-metadata/item-details-metadata.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [ItemDetailComponent, ItemDetailMetadataComponent, ItemOutputComponent, NgFor, InputOutputComponent, InTheMetadataComponent, AliasingComponent]
})

// #docregion parent-property
// #docregion add-new-item
export class AppComponent {
// #enddocregion add-new-item
  currentItem = 'Television';
  // #enddocregion parent-property

  lastChanceItem = 'Beanbag';
// #docregion add-new-item
  items = ['item1', 'item2', 'item3', 'item4'];
// #enddocregion add-new-item
  wishlist = ['Drone', 'Computer'];

  // #docregion add-new-item

  addItem(newItem: string) {
    this.items.push(newItem);
  }
  // #enddocregion add-new-item


  crossOffItem(item: string) {
    console.warn(`Parent says: crossing off ${item}.`);
  }

  buyClearanceItem(item: string) {
    console.warn(`Parent says: buying ${item}.`);
  }

  saveForLater(item: string) {
    console.warn(`Parent says: saving ${item} for later.`);
  }

  addToWishList(wish: string) {
    console.warn(`Parent says: adding ${this.currentItem} to your wishlist.`);
    this.wishlist.push(wish);
    console.warn(this.wishlist);
  }
// #docregion add-new-item
// #docregion parent-property
}
// #enddocregion add-new-item
// #enddocregion parent-property

