import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {UserService} from "./core/services/user.service";
import {ImpersonationService} from "./core/services/impersonation.service";
import {SessionExpirationAlertComponent, SessionTimerService} from "session-expiration-alert";
import {SessionInterruptorService} from "./core/services/session-interruptor.service";
import {provideRouter} from '@angular/router';
import * as axe from "axe-core";
import {of} from "rxjs";

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let impersonationServiceSpy: jasmine.SpyObj<ImpersonationService>;
    let sessionTimerServiceSpy: jasmine.SpyObj<SessionTimerService>;
    let sessionInterruptorServiceSpy: jasmine.SpyObj<SessionInterruptorService>;

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
        sessionTimerServiceSpy = jasmine.createSpyObj('SessionTimerService', ['startTimer', 'stopTimer', 'remainSeconds$']);
        sessionTimerServiceSpy.remainSeconds$ = of(300);
        sessionInterruptorServiceSpy = jasmine.createSpyObj('SessionInterruptorService', ['interruptSession']);

        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                {provide: UserService, useValue: userServiceSpy},
                {provide: ImpersonationService, useValue: impersonationServiceSpy},
                provideRouter([])
            ]
        }).overrideComponent(
            SessionExpirationAlertComponent,
            {
                set: {
                    providers: [
                        {provide: SessionInterruptorService, useValue: sessionInterruptorServiceSpy},
                        {provide: SessionTimerService, useValue: sessionTimerServiceSpy}]
                }
            }
        ).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        fixture.autoDetectChanges(true);
    });

    it('should create the app', () => {
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have the 'OrderManager' title`, () => {
        const app = fixture.componentInstance;
        expect(app.applicationName).toEqual('OrderManager');
    });

    it('should have header', () => {
        //uiowa-header element not h1
        const uiowaHeader = fixture.nativeElement.querySelector('uiowa-header');
        expect(uiowaHeader).toBeTruthy();
    });

    it('should have footer', () => {
        const footer = fixture.nativeElement.querySelector('app-footer');
        expect(footer).toBeTruthy();
    });

    it('should be accessible', async () => {
        const element = fixture.nativeElement;
        expect(await axe.run(element)).toHaveNoViolations();
    });
});