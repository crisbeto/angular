import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-reactive-favorite-color',
    template: `
    Favorite Color: <input type="text" [formControl]="favoriteColorControl">
  `,
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule]
})
export class FavoriteColorComponent {
  favoriteColorControl = new FormControl('');
}
