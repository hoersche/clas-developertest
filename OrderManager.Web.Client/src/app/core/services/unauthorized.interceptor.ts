import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {LoginService} from '@uiowa/uiowa-header';
import {Router} from '@angular/router';
import {Location} from "@angular/common";

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
    constructor(
        private readonly loginService: LoginService,
        private router: Router,
        private readonly location: Location
    ) {
    }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((err) => {
                if (err.status === 401) {
                    this.loginService.returnUri = this.location.prepareExternalUrl(this.router.url);
                    this.loginService.login();
                }
                throw err;
            })
        );
    }
}
