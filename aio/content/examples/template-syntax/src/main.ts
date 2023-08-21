import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { heroSwitchComponents } from './app/hero-switch.components';
import { FormsModule } from '@angular/forms';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, heroSwitchComponents),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
