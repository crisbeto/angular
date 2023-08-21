import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AboutComponent } from './app/about.component';
import { HomeComponent } from './app/home.component';
import { QueryingComponent } from './app/querying.component';
import { InsertRemoveComponent } from './app/insert-remove.component';
import { HeroListAutoCalcPageComponent } from './app/hero-list-auto-page.component';
import { HeroListEnterLeavePageComponent } from './app/hero-list-enter-leave-page.component';
import { HeroListGroupPageComponent } from './app/hero-list-group-page.component';
import { HeroListPageComponent } from './app/hero-list-page.component';
import { ToggleAnimationsPageComponent } from './app/toggle-animations-page.component';
import { StatusSliderPageComponent } from './app/status-slider-page.component';
import { OpenClosePageComponent } from './app/open-close-page.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        provideAnimations(),
        provideRouter([
            { path: '', pathMatch: 'full', redirectTo: '/enter-leave' },
            {
                path: 'open-close',
                component: OpenClosePageComponent,
                data: { animation: 'openClosePage' }
            },
            {
                path: 'status',
                component: StatusSliderPageComponent,
                data: { animation: 'statusPage' }
            },
            {
                path: 'toggle',
                component: ToggleAnimationsPageComponent,
                data: { animation: 'togglePage' }
            },
            {
                path: 'heroes',
                component: HeroListPageComponent,
                data: { animation: 'filterPage' }
            },
            {
                path: 'hero-groups',
                component: HeroListGroupPageComponent,
                data: { animation: 'heroGroupPage' }
            },
            {
                path: 'enter-leave',
                component: HeroListEnterLeavePageComponent,
                data: { animation: 'enterLeavePage' }
            },
            {
                path: 'auto',
                component: HeroListAutoCalcPageComponent,
                data: { animation: 'autoPage' }
            },
            {
                path: 'insert-remove',
                component: InsertRemoveComponent,
                data: { animation: 'insertRemovePage' }
            },
            {
                path: 'querying',
                component: QueryingComponent,
                data: { animation: 'queryingPage' }
            },
            {
                path: 'home',
                component: HomeComponent,
                data: { animation: 'HomePage' }
            },
            {
                path: 'about',
                component: AboutComponent,
                data: { animation: 'AboutPage' }
            },
        ]),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
