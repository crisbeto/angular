// #docregion
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';
import { AdService } from './app/ad.service';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        AdService,
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
