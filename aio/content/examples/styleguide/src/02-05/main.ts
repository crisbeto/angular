// #docregion
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { RouterModule } from '@angular/router';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule,
        // #enddocregion
        RouterModule.forChild([{ path: '02-05', component: AppComponent }])
        // #docregion
        ),
        provideProtractorTestingSupport()
    ]
})
  .then(success => console.log(`Bootstrap success`))
  .catch(err => console.error(err));
