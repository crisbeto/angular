import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

import { CrisisService } from '../crisis.service';
import { Crisis } from '../crisis';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-crisis-list',
    templateUrl: './crisis-list.component.html',
    styleUrls: ['./crisis-list.component.css'],
    standalone: true,
    imports: [NgFor, RouterLink, RouterOutlet, AsyncPipe]
})
export class CrisisListComponent implements OnInit {
  crises$?: Observable<Crisis[]>;
  selectedId = 0;

  constructor(
    private service: CrisisService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.crises$ = this.route.firstChild?.paramMap.pipe(
      switchMap(params => {
        this.selectedId = parseInt(params.get('id')!, 10);
        return this.service.getCrises();
      })
    );
  }
}
