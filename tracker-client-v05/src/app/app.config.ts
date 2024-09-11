import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import {provideRouter, withDebugTracing} from '@angular/router';

import { routes } from './app.routes';
import {HttpClientModule} from "@angular/common/http";
import { provideAnimations } from '@angular/platform-browser/animations';
import {POSITION_OPTIONS} from "@ng-web-apis/geolocation";
import { provideServiceWorker } from '@angular/service-worker';
//import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy, PathLocationStrategy} from "@angular/common";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes /*, withDebugTracing()*/),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    {
        provide: POSITION_OPTIONS,
        useValue: { enableHighAccuracy: true, timeout: 3000, maximumAge: 1000 },
    }, provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }), provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })]
};
