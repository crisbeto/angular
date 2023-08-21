import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { ItemSwitchComponents } from './app/item-switch.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule // <--- import into the NgModule
        , ItemSwitchComponents),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
