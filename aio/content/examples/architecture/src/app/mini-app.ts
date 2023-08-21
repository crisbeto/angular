// #docplaster
// A mini-application
import { Injectable, importProvidersFrom } from '@angular/core';

@Injectable()
export class Logger {
  log(message: string) { console.log(message); }
}

import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: 'Welcome to Angular',
    standalone: true
})
export class AppComponent {
  constructor(logger: Logger) {
    logger.log('Let the fun begin!');
  }
}

// #docregion module
import { NgModule } from '@angular/core';
// #docregion import-browser-module
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';
// #enddocregion import-browser-module

// #enddocregion module

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Logger as Logger_1, AppComponent as AppComponent_1 } from './mini-app';

bootstrapApplication(AppComponent_1, {
    providers: [
        importProvidersFrom(BrowserModule),
        Logger,
        provideProtractorTestingSupport()
    ]
});
