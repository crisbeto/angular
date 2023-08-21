import { Component } from '@angular/core';

import { CustomersService } from './customers.service';
import { UserService } from '../greeting/user.service';
import { RouterOutlet } from '@angular/router';

@Component({
    template: `
    <h2>Customers of {{userName}}</h2>
    <router-outlet></router-outlet>
  `,
    providers: [UserService],
    standalone: true,
    imports: [RouterOutlet]
})
export class CustomersComponent {
  userName = '';
  constructor(userService: UserService) {
    this.userName = userService.userName;
  }
}

