import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { HeroData } from './app/hero-data';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, InMemoryWebApiModule.forRoot(HeroData), s0101.AppModule, s0205.AppModule, s0207.AppModule, s0208.AppModule, s0408.AppModule, s0410.AppModule, s0502.AppModule, s0503.AppModule, s0504.AppModule, s0512.AppModule, s0513.AppModule, s0514.AppModule, s0515.AppModule, s0516.AppModule, s0517.AppModule, s0601.AppModule, s0603.AppModule, s0701.AppModule, s0704.AppModule, s0901.AppModule),
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([
            { path: '', redirectTo: '/01-01', pathMatch: 'full' }
        ]),
        provideProtractorTestingSupport()
    ]
});
