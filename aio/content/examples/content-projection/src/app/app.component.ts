import { Component } from '@angular/core';
import { ZippyNgprojectasComponent } from './zippy-ngprojectas/zippy-ngprojectas.component';
import { ZippyComponent, ZippyToggleDirective, ZippyContentDirective } from './example-zippy.component';
import { ZippyMultislotComponent } from './zippy-multislot/zippy-multislot.component';
import { ZippyBasicComponent } from './zippy-basic/zippy-basic.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [ZippyBasicComponent, ZippyMultislotComponent, ZippyComponent, ZippyToggleDirective, ZippyContentDirective, ZippyNgprojectasComponent]
})
export class AppComponent {}
