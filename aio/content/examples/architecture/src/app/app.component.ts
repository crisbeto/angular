// #docregion import
import { Component } from '@angular/core';
import { SalesTaxComponent } from './sales-tax.component';
import { HeroListComponent } from './hero-list.component';
// #enddocregion import

@Component({
    selector: 'app-root',
    template: `
    <h1>Architecture Example</h1>
    <app-hero-list></app-hero-list>
    <app-sales-tax></app-sales-tax>
  `,
    standalone: true,
    imports: [HeroListComponent, SalesTaxComponent]
})
export class AppComponent { }
