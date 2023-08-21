import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SizerComponent } from './sizer/sizer.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [SizerComponent, FormsModule]
})
export class AppComponent {
  // #docregion font-size
  fontSizePx = 16;
  // #enddocregion font-size
}
