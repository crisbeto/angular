import { Component } from '@angular/core';
import { UsersComponent } from './users/users.component';
import { HeroComponent } from './heroes/hero.component';

@Component({
    selector: 'sg-app',
    template: `
    <toh-hero></toh-hero>
    <admin-users></admin-users>
  `,
    standalone: true,
    imports: [HeroComponent, UsersComponent]
})
export class AppComponent { }
