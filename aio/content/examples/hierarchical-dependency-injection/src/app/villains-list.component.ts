// #docregion
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Villain, VillainsService } from './villains.service';
import { NgFor, AsyncPipe } from '@angular/common';

// #docregion metadata
@Component({
    selector: 'app-villains-list',
    templateUrl: './villains-list.component.html',
    providers: [VillainsService],
    standalone: true,
    imports: [NgFor, AsyncPipe]
})
// #enddocregion metadata
export class VillainsListComponent {
  villains: Observable<Villain[]>;

  constructor(private villainsService: VillainsService) {
    this.villains = villainsService.getVillains();
  }
}
