// #docregion
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { HeroData } from './app/hero-data';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, InMemoryWebApiModule.forRoot(HeroData)
        // AppRoutingModule TODO: add routes
        ),
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        provideHttpClient(withInterceptorsFromDi()),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));

