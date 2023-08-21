import { Component } from '@angular/core';
import { HeroHighlightDirective } from './heroes/shared/hero-highlight.directive';
import { HeroButtonComponent } from './heroes/shared/hero-button/hero-button.component';

@Component({
    selector: 'sg-app',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [HeroButtonComponent, HeroHighlightDirective]
})
export class AppComponent {

  doSomething() {}
}
