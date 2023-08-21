import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';
import { APP_CONFIG, HERO_DI_CONFIG } from './app/app.config';
import { UserService } from './app/user.service';
import { Logger } from './app/logger.service';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        Logger,
        UserService,
        { provide: APP_CONFIG, useValue: HERO_DI_CONFIG },
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
