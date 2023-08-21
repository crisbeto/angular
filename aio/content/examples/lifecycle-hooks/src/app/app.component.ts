// #docregion
import { Component } from '@angular/core';
import { CounterParentComponent } from './counter-parent.component';
import { AfterContentParentComponent } from './after-content-parent.component';
import { AfterViewParentComponent } from './after-view-parent.component';
import { DoCheckParentComponent } from './do-check-parent.component';
import { OnChangesParentComponent } from './on-changes-parent.component';
import { SpyParentComponent } from './spy.component';
import { PeekABooParentComponent } from './peek-a-boo-parent.component';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [PeekABooParentComponent, SpyParentComponent, OnChangesParentComponent, DoCheckParentComponent, AfterViewParentComponent, AfterContentParentComponent, CounterParentComponent]
})
export class AppComponent { }
