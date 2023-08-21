// #docregion
import { Component } from '@angular/core';

import { Hero, heroes } from './hero';
import { ContentComponent } from './content.component';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [NgIf, NgFor, FormsModule, ContentComponent, UpperCasePipe]
})
export class AppComponent {
  heroes = heroes;
  hero: Hero | null = this.heroes[0];
  heroTraits = ['honest', 'brave', 'considerate'];

  // flags for the table

  attrDirs = true;
  strucDirs = true;
  divNgIf = false;

  showId = true;
  showDefaultTraits = true;
  showSad = true;
}
