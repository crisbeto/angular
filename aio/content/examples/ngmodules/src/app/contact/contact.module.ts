import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';

import { ContactComponent } from './contact.component';
import { ContactService } from './contact.service';
import { ContactRoutingModule } from './contact-routing.module';

@NgModule({
    imports: [
    ContactRoutingModule,
    ReactiveFormsModule,
    ContactComponent
],
    providers: [ContactService]
})
export class ContactModule { }
