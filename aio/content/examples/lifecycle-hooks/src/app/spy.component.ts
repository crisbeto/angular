// #docregion
import { Component } from '@angular/core';

import { LoggerService } from './logger.service';
import { SpyDirective } from './spy.directive';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'spy-parent',
    templateUrl: './spy.component.html',
    providers: [LoggerService],
    standalone: true,
    imports: [FormsModule, NgFor, SpyDirective]
})
export class SpyParentComponent {
  newName = 'Herbie';
  heroes: string[] = ['Windstorm', 'Magneta'];

  constructor(public logger: LoggerService) {
  }

  addHero() {
    if (this.newName.trim()) {
      this.heroes.push(this.newName.trim());
      this.newName = '';
      this.logger.tick();
    }
  }
  removeHero(hero: string) {
    this.heroes.splice(this.heroes.indexOf(hero), 1);
    this.logger.tick();
  }
  reset() {
    this.logger.log('reset');
    this.heroes = [];
    this.logger.tick();
  }
}
