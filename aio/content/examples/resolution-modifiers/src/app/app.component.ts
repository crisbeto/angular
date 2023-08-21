import { Component } from '@angular/core';
import { LeafService } from './leaf.service';
import { FlowerService } from './flower.service';
import { HostParentComponent } from './host-parent/host-parent.component';
import { SkipselfComponent } from './skipself/skipself.component';
import { SelfNoDataComponent } from './self-no-data/self-no-data.component';
import { SelfComponent } from './self/self.component';
import { OptionalComponent } from './optional/optional.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [OptionalComponent, SelfComponent, SelfNoDataComponent, SkipselfComponent, HostParentComponent]
})
export class AppComponent {
  name = 'Angular';
  constructor(public flower: FlowerService, public leaf: LeafService) {}
}
