import { NgModule } from '@angular/core';

import { routedComponents, HeroRoutingModule } from './hero-routing.module';

@NgModule({
    imports: [HeroRoutingModule, routedComponents]
})
export class HeroModule { }
