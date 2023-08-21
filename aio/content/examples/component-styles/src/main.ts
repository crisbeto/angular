// #docregion
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { HeroAppComponent } from './app/hero-app.component';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(HeroAppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
