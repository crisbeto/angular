// #docregion
import {HttpClientXsrfModule, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {importProvidersFrom} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {bootstrapApplication, BrowserModule, provideProtractorTestingSupport} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';

import {AppComponent} from './app/app.component';
import {AuthService} from './app/auth.service';
import {HttpErrorHandler} from './app/http-error-handler.service';
import {httpInterceptorProviders} from './app/http-interceptors/index';
import {InMemoryDataService} from './app/in-memory-data.service';
import {MessageService} from './app/message.service';
import {RequestCache, RequestCacheWithMap} from './app/request-cache.service';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
        // #enddocregion xsrf
        BrowserModule,
        // #enddocregion sketch
        FormsModule,
        // #enddocregion sketch
        HttpClientXsrfModule.withOptions({
          cookieName: 'My-Xsrf-Cookie',
          headerName: 'My-Xsrf-Header',
        }),
        // #enddocregion xsrf
        // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
        // and returns simulated server responses.
        // Remove it when a real server is ready to receive requests.
        HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
          dataEncapsulation: false,
          passThruUnknownUrl: true,
          put204: false  // return entity after PUT/update
        })
        // #docregion sketch, xsrf
        ),
    // #enddocregion interceptor-providers
    AuthService, HttpErrorHandler, MessageService,
    {provide: RequestCache, useClass: RequestCacheWithMap},
    // #docregion interceptor-providers
    httpInterceptorProviders, provideHttpClient(withInterceptorsFromDi()),
    provideProtractorTestingSupport()
  ]
}).catch(err => console.error(err));
