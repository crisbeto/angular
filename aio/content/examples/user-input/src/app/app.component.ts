// #docregion
import { Component } from '@angular/core';
import { LittleTourComponent } from './little-tour.component';
import { LoopbackComponent } from './loop-back.component';
import { KeyUpComponent_v1, KeyUpComponent_v2, KeyUpComponent_v3, KeyUpComponent_v4 } from './keyup.components';
import { ClickMe2Component } from './click-me2.component';
import { ClickMeComponent } from './click-me.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [ClickMeComponent, ClickMe2Component, KeyUpComponent_v1, LoopbackComponent, KeyUpComponent_v2, KeyUpComponent_v3, KeyUpComponent_v4, LittleTourComponent]
})
export class AppComponent { }
