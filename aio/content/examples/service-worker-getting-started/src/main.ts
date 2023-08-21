import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { AppComponent } from './app/app.component';
import { isDevMode, importProvidersFrom } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';
import { PromptUpdateService } from './app/prompt-update.service';
import { LogUpdateService } from './app/log-update.service';
import { CheckForUpdateService } from './app/check-for-update.service';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, ServiceWorkerModule.register('/ngsw-worker.js', { enabled: !isDevMode() })),
        CheckForUpdateService,
        LogUpdateService,
        PromptUpdateService,
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
