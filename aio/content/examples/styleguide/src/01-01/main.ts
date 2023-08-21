// #docregion
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { RouterModule } from '@angular/router';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule,
        // #enddocregion
        RouterModule.forChild([{ path: '01-01', component: AppComponent }])
        // #docregion
        ),
        provideProtractorTestingSupport()
    ]
});
