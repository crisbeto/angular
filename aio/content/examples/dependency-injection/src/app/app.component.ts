import { Component, Inject } from '@angular/core';

import { APP_CONFIG, AppConfig } from './app.config';
import { UserService } from './user.service';
import { HeroesTspComponent } from './heroes/heroes-tsp.component';
import { HeroesComponent } from './heroes/heroes.component';
import { NgIf } from '@angular/common';
import { TestComponent } from './test.component';
import { InjectorComponent } from './injector.component';
import { CarComponent } from './car/car.component';

@Component({
    selector: 'app-root',
    template: `
    <h1>{{title}}</h1>
    <app-car></app-car>
    <app-injectors></app-injectors>
    <app-tests></app-tests>
    <h2>User</h2>
    <p id="user">
      {{userInfo}}
      <button type="button" (click)="nextUser()">Next User</button>
    <p>
    <app-heroes id="authorized" *ngIf="isAuthorized"></app-heroes>
    <app-heroes id="unauthorized" *ngIf="!isAuthorized"></app-heroes>
    <app-heroes-tsp id="tspAuthorized" *ngIf="isAuthorized"></app-heroes-tsp>
    <app-providers></app-providers>
  `,
    standalone: true,
    imports: [CarComponent, InjectorComponent, TestComponent, NgIf, HeroesComponent, HeroesTspComponent]
})
export class AppComponent {
  title: string;

  constructor(
    @Inject(APP_CONFIG) config: AppConfig,
    private userService: UserService) {
    this.title = config.title;
  }

  get isAuthorized() { return this.user.isAuthorized; }
  nextUser()         { this.userService.getNewUser(); }
  get user()         { return this.userService.user; }

  get userInfo()     {
    return `Current user, ${this.user.name}, is ` +
           `${this.isAuthorized ? '' : 'not'} authorized. `;
  }
}
