import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// #docregion lazyload-syntax, lazyload-deprecated-syntax
const routes: Routes = [{
        path: 'lazy',
        // #enddocregion lazyload-deprecated-syntax
        // The new import() syntax
        loadChildren: () => import('./app/lazy/lazy.module').then(m => m.LazyModule)
        // #enddocregion lazyload-syntax
        /*
        // #docregion lazyload-deprecated-syntax
        // The following string syntax for loadChildren is deprecated
        loadChildren: './lazy/lazy.module#LazyModule',
        // #enddocregion lazyload-deprecated-syntax
        */
        // #docregion lazyload-syntax, lazyload-deprecated-syntax
    }];


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
        // #enddocregion reactive-form-no-warning
        RouterModule.forChild(routes), FormsModule, BrowserModule,
        // #docregion reactive-form-no-warning
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' })),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
