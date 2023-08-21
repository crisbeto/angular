import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-template-favorite-color',
    template: `
    Favorite Color: <input type="text" [(ngModel)]="favoriteColor">
  `,
    standalone: true,
    imports: [FormsModule]
})
export class FavoriteColorComponent {
  favoriteColor = '';
}
