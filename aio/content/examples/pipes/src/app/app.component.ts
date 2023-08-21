// #docregion
import { Component } from '@angular/core';
import { UpperCasePipe, DatePipe } from '@angular/common';
import { PrecedenceComponent } from './precedence.component';
import { HeroListComponent } from './hero-list.component';
import { HeroAsyncMessageComponent } from './hero-async-message.component';
import { FlyingHeroesComponent, FlyingHeroesImpureComponent } from './flying-heroes.component';
import { PowerBoostCalculatorComponent } from './power-boost-calculator.component';
import { PowerBoosterComponent } from './power-booster.component';
import { HeroBirthday2Component } from './hero-birthday2.component';
import { HeroBirthdayComponent } from './hero-birthday1.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: ['a[href] {display: block; padding: 10px 0;}', 'a:hover {text-decoration: none;}', 'h2 {margin: 0;}'],
    standalone: true,
    imports: [HeroBirthdayComponent, HeroBirthday2Component, PowerBoosterComponent, PowerBoostCalculatorComponent, FlyingHeroesComponent, FlyingHeroesImpureComponent, HeroAsyncMessageComponent, HeroListComponent, PrecedenceComponent, UpperCasePipe, DatePipe]
})
export class AppComponent {
  birthday = new Date(1988, 3, 15); // April 15, 1988 -- since month parameter is zero-based
}
