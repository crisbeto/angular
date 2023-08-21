import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { PageNotFoundComponent } from './app/page-not-found/page-not-found.component';
import { HeroesListComponent } from './app/heroes-list/heroes-list.component';
import { CrisisListComponent } from './app/crisis-list/crisis-list.component';
import { provideRouter } from '@angular/router';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        provideRouter([
            { path: 'crisis-list', component: CrisisListComponent },
            { path: 'heroes-list', component: HeroesListComponent },
            // #enddocregion import-basic
            { path: '', redirectTo: '/heroes-list', pathMatch: 'full' },
            // #enddocregion import-redirect
            { path: '**', component: PageNotFoundComponent }
            // #enddocregion import-wildcard
            // #docregion import-basic, import-redirect, import-wildcard
        ]),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
