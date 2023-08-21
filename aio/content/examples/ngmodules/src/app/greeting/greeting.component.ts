import { Component } from '@angular/core';
import { UserService } from '../greeting/user.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-greeting',
    templateUrl: './greeting.component.html',
    standalone: true,
    imports: [NgIf],
})
export class GreetingComponent {
  title = 'NgModules';
  user = '';

  constructor(userService: UserService) {
    this.user = userService.userName;
  }
}
