import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';
import { Phone } from './core/phone/phone.service';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, AppRoutingModule),
        Phone,
        provideHttpClient(withInterceptorsFromDi()),
        provideProtractorTestingSupport()
    ]
});
