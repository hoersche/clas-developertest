import {Injectable} from '@angular/core';
import {SessionInterruptService} from 'session-expiration-alert';
import {UserService} from './user.service';
import {LoginService} from '@uiowa/uiowa-header';

@Injectable()
export class SessionInterruptorService extends SessionInterruptService {
    constructor(
        private readonly userService: UserService,
        private readonly loginService: LoginService
    ) {
        super();
    }

    continueSession() {
        this.userService.authenticate();
    }

    stopSession() {
        this.loginService.logout();
    }
}
