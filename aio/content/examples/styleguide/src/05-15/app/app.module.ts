import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeroListComponent } from './heroes';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forChild([{ path: '05-15', component: AppComponent }]),
        AppComponent,
        HeroListComponent
    ],
    exports: [AppComponent]
})
export class AppModule {}
