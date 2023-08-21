import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';
import { PopupService } from './app/popup.service';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        PopupService,
        provideAnimations(),
        provideProtractorTestingSupport(),
    ]
})
  .catch(err => console.error(err));
