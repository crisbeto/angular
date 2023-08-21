import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Customer,
         CustomersService } from './customers.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HighlightDirective } from '../shared/highlight.directive';

@Component({
    template: `
    <h3 highlight>Customer Detail</h3>
    <div *ngIf="customer">
      <div>Id: {{customer.id}}</div><br>
      <label for="name">Name:
        <input id="name" [(ngModel)]="customer.name">
      </label>
    </div>
    <br>
    <a routerLink="../">Customer List</a>
  `,
    standalone: true,
    imports: [HighlightDirective, NgIf, FormsModule, RouterLink]
})
export class CustomersDetailComponent implements OnInit {
  customer!: Customer;

  constructor(
    private route: ActivatedRoute,
    private customersService: CustomersService) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.customersService.getCustomer(id).subscribe(customer => this.customer = customer);
  }
}
