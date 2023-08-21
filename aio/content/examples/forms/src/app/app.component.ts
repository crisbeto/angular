// #docregion
import { Component } from '@angular/core';
import { HeroFormComponent } from './hero-form/hero-form.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [HeroFormComponent]
})
export class AppComponent { }
