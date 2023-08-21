// main app entry point
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { InMemoryDataService } from './app/in-memory-data.service';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing.module';
import { DashboardModule } from './app/dashboard/dashboard.module';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';
import { UserService } from './app/model/user.service';
import { TwainService } from './app/twain/twain.service';
import { HeroService } from './app/model/hero.service';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, DashboardModule, AppRoutingModule,
        // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
        // and returns simulated server responses.
        // Remove it when a real server is ready to receive requests.
        HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false })),
        HeroService,
        TwainService,
        UserService,
        provideHttpClient(withInterceptorsFromDi()),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
