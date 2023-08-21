import { Component } from '@angular/core';
import { ToastComponent } from './shared/toast/toast.component';

@Component({
    selector: 'sg-app',
    template: `<toh-toast></toh-toast>`,
    standalone: true,
    imports: [ToastComponent]
})
export class AppComponent { }
