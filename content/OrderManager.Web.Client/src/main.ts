import { enableProdMode, importProvidersFrom, ErrorHandler, inject, provideAppInitializer } from '@angular/core';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SessionExpirationAlert, SessionInterruptService } from 'session-expiration-alert';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import { provideRouter } from '@angular/router';
import { routes } from './app/app.routing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {UserService} from "./app/core/services/user.service";
import {AppErrorHandler} from "./app/core/services/app-error-handler";
import {SessionInterruptorService} from "./app/core/services/session-interruptor.service";
import {UnauthorizedInterceptor} from "./app/core/services/unauthorized.interceptor";
import {HttpCacheControlService} from "./app/core/services/http-cache-control.service";

if (environment.production) {
  enableProdMode();
}

export function appUserServiceFactory(userService: UserService) {
    return () => userService.authenticate();
}


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, NgbModule, ToastrModule.forRoot(), SessionExpirationAlert.forRoot(), FontAwesomeModule),
        provideAppInitializer(() => {
        const initializerFn = (appUserServiceFactory)(inject(UserService));
        return initializerFn();
      }),
        provideRouter(routes),
        provideAnimations(),
        {
            provide: ErrorHandler,
            useClass: AppErrorHandler,
        },
        { provide: SessionInterruptService, useClass: SessionInterruptorService },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UnauthorizedInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpCacheControlService,
            multi: true,
        },
        provideHttpClient(withInterceptorsFromDi()),
    ]
})
  .catch(err => console.error(err));
