import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forChild([{ path: '07-01', component: AppComponent }]),
        AppComponent
    ],
    exports: [AppComponent]
})
export class AppModule {}
