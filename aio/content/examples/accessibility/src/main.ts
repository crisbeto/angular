import {importProvidersFrom} from '@angular/core';
import {bootstrapApplication, BrowserModule, provideProtractorTestingSupport} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppComponent} from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserModule), provideProtractorTestingSupport()]
}).catch(err => console.error(err));
