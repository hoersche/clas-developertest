import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AppFooterComponent} from "./app-footer.component";
import * as axe from "axe-core";

describe('AppFooterComponent', () => {
    let component: AppFooterComponent;
    let fixture: ComponentFixture<AppFooterComponent>;

    beforeEach(async () => {
    

        await TestBed.configureTestingModule({
            imports: [ AppFooterComponent],
            providers: [],
        }).compileComponents();

        fixture = TestBed.createComponent(AppFooterComponent);
        fixture.autoDetectChanges();
        component = fixture.componentInstance;
    });

    it('builds the component successfully', () => {
        expect(component).toBeTruthy();
    });
    
    it('should be accessible', async () => {
        const n = fixture.nativeElement;
        expect(await(axe.run(n))).toHaveNoViolations();
    });
});

