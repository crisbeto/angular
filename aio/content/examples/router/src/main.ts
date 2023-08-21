// #docregion
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { AuthModule } from './app/auth/auth.module';
import { HeroesModule } from './app/heroes/heroes.module';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
        // #enddocregion animations-module
        BrowserModule,
        // #enddocregion animations-module
        FormsModule, HeroesModule, AuthModule, AppRoutingModule),
        provideAnimations(),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
