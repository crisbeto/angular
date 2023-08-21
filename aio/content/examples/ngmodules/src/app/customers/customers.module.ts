import { NgModule } from '@angular/core';



import { CustomersComponent } from './customers.component';
import { CustomersDetailComponent } from './customers-detail.component';
import { CustomersListComponent } from './customers-list.component';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersService } from './customers.service';


@NgModule({
    imports: [CustomersRoutingModule, CustomersComponent, CustomersDetailComponent, CustomersListComponent],
    providers: [CustomersService]
})
export class CustomersModule { }
