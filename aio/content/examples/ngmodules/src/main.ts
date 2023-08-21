import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { GreetingModule } from './app/greeting/greeting.module';
import { ContactModule } from './app/contact/contact.module';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
        // #enddocregion import-for-root
        BrowserModule, ContactModule,
        // #docregion import-for-root
        GreetingModule.forRoot({ userName: 'Miss Marple' }),
        // #enddocregion import-for-root
        AppRoutingModule
        // #docregion import-for-root
        ),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
