import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import {provideRouter} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import { provideAnimations } from '@angular/platform-browser/animations';
import { WA_POSITION_OPTIONS} from "@ng-web-apis/geolocation";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes /*, withDebugTracing()*/),
    provideHttpClient(),
    provideAnimations(),
    {
        provide: WA_POSITION_OPTIONS,
        useValue: { enableHighAccuracy: true, timeout: 3000, maximumAge: 1000 },
    }]
};
