import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { ProductListComponent } from './app/product-list/product-list.component';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, ReactiveFormsModule),
        provideRouter([
            { path: '', component: ProductListComponent },
        ]),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
