import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
        // #enddocregion imports
        BrowserModule,
        // #docregion imports
        // other imports ...
        ReactiveFormsModule),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
