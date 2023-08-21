// #docregion
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { ProfileComponent } from './app/profile/profile.component';
import { provideRouter, UrlSegment } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule),
        provideRouter([
            // #enddocregion imports-array
            // #docregion matcher
            {
                matcher: (url) => {
                    if (url.length === 1 && url[0].path.match(/^@[\w]+$/gm)) {
                        return {
                            consumed: url,
                            posParams: {
                                username: new UrlSegment(url[0].path.slice(1), {})
                            }
                        };
                    }
                    return null;
                },
                component: ProfileComponent
            }
            // #enddocregion matcher
            // #docregion imports-array
        ]),
        provideProtractorTestingSupport()
    ]
})
  .catch(err => console.error(err));
