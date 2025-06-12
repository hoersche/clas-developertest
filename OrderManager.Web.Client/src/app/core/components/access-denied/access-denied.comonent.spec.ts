import {ComponentFixture, TestBed} from '@angular/core/testing';

import * as axe from "axe-core";
import {AccessDeniedComponent} from "./access-denied.component";
import {UserService} from "../../services/user.service";
import {LoginService} from "@uiowa/uiowa-header";

describe('AccessDeniedComponent', () => {
    let component: AccessDeniedComponent;
    let fixture: ComponentFixture<AccessDeniedComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let loginServiceSpy: jasmine.SpyObj<LoginService>;
    beforeEach(async () => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['getCurrentUser']);
        loginServiceSpy = jasmine.createSpyObj('LoginService', ['getLogin']);
        await TestBed.configureTestingModule({
            imports: [AccessDeniedComponent],
            providers: [
                {provide: UserService, useValue: userServiceSpy},
                {provide: LoginService, useValue: loginServiceSpy},
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AccessDeniedComponent);
        fixture.autoDetectChanges(true);
        component = fixture.componentInstance;
    });

    it('builds the component successfully', () => {
        expect(component).toBeTruthy();
    });

    it('should be accessible', async () => {
        const n = fixture.nativeElement;
        expect(await (axe.run(n))).toHaveNoViolations();
    });
});

