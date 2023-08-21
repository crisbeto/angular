import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyRoutingModule } from './lazy-routing.module';
import { LazyComponent } from './lazy.component';


@NgModule({
    imports: [
        CommonModule,
        LazyRoutingModule,
        LazyComponent
    ]
})
export class LazyModule { }
