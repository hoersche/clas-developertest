import {ComponentFixture, TestBed} from '@angular/core/testing';

import * as axe from "axe-core";
import {ImpersonationComponent} from "./impersonation.component";
import {UserService} from "../../services/user.service";
import {ImpersonationService} from "../../services/impersonation.service";

describe('ImpersonationComponent', () => {
    let component: ImpersonationComponent;
    let fixture: ComponentFixture<ImpersonationComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let impersonationServiceSpy: jasmine.SpyObj<ImpersonationService>;
    beforeEach(async () => {

        userServiceSpy = jasmine.createSpyObj('UserService', ['getCurrentUser']);
        userServiceSpy.getCurrentUser.and.returnValue({
            hawkId: 'testUser',
            role: '',
            isAuthenticated: () => true,
            isBasicUser: () => true,
            isAdmin: () => true,
            isWebMaster: () => true
        });
        impersonationServiceSpy = jasmine.createSpyObj('ImpersonationService', ['stopImpersonate']);
        await TestBed.configureTestingModule({
            imports: [ImpersonationComponent],
            providers: [
                {provide: UserService, useValue: userServiceSpy},
                {provide: ImpersonationService, useValue: impersonationServiceSpy},
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ImpersonationComponent);
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

