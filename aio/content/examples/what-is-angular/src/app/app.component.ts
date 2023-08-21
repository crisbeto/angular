import { Component } from '@angular/core';
import { HelloWorldDependencyInjectionComponent } from './hello-world-di/hello-world-di.component';
import { HelloWorldNgIfComponent } from './hello-world-ngif/hello-world-ngif.component';
import { HelloWorldTemplateComponent } from './hello-world-template.component';
import { HelloWorldBindingsComponent } from './hello-world-bindings/hello-world-bindings.component';
import { HelloWorldInterpolationComponent } from './hello-world-interpolation/hello-world-interpolation.component';
import { HelloWorldComponent } from './hello-world/hello-world.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [HelloWorldComponent, HelloWorldInterpolationComponent, HelloWorldBindingsComponent, HelloWorldTemplateComponent, HelloWorldNgIfComponent, HelloWorldDependencyInjectionComponent]
})
export class AppComponent { }
