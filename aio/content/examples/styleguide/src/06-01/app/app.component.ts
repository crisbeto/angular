import { Component } from '@angular/core';
import { HighlightDirective } from './shared/highlight.directive';

@Component({
    selector: 'sg-app',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [HighlightDirective]
})
export class AppComponent { }
