import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Customer,
         CustomersService } from './customers.service';
import { RouterLink } from '@angular/router';
import { NgFor, AsyncPipe } from '@angular/common';
import { HighlightDirective } from '../shared/highlight.directive';

@Component({
    template: `
    <h3 highlight>Customer List</h3>
    <div *ngFor='let customer of customers | async'>
      <a routerLink="{{customer.id}}">{{customer.id}} - {{customer.name}}</a>
    </div>
  `,
    standalone: true,
    imports: [HighlightDirective, NgFor, RouterLink, AsyncPipe]
})

export class CustomersListComponent {
  customers: Observable<Customer[]>;
  constructor(private customersService: CustomersService) {
    this.customers = this.customersService.getCustomers();
  }
}

