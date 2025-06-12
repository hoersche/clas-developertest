import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {LoginService} from '@uiowa/uiowa-header';
import {Location} from "@angular/common";
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: './access-denied.component.html',
    styleUrls: ['./access-denied.component.css'],
    imports: [NgbAlert]
})
export class AccessDeniedComponent implements OnInit {
    constructor(
        private readonly loginService: LoginService,
        public readonly userService: UserService,
        private readonly location: Location
    ) {
    }

    ngOnInit() {
    }

    login() {
        this.loginService.returnUri = this.location.prepareExternalUrl('/home');
        this.loginService.login();
    }
}
