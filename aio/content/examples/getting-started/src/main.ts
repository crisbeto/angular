import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { ShippingComponent } from './app/shipping/shipping.component';
import { CartComponent } from './app/cart/cart.component';
import { ProductDetailsComponent } from './app/product-details/product-details.component';
import { ProductListComponent } from './app/product-list/product-list.component';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule,
        // #docregion product-details-route, cart-route
        ReactiveFormsModule),
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([
            { path: '', component: ProductListComponent },
            { path: 'products/:productId', component: ProductDetailsComponent },
            // #enddocregion product-details-route
            { path: 'cart', component: CartComponent },
            // #enddocregion cart-route, http-client-module
            { path: 'shipping', component: ShippingComponent },
            // #enddocregion shipping-route
            // #docregion product-details-route, http-client-module, shipping-route, cart-route
        ]),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
