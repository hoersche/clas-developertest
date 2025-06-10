import {ComponentFixture, TestBed} from '@angular/core/testing';

import * as axe from "axe-core";
import {PaginationComponent} from "./pagination.component";

describe('AppPaginationComponent', () => {
    let component: PaginationComponent;
    let fixture: ComponentFixture<PaginationComponent>;

    beforeEach(async () => {


        await TestBed.configureTestingModule({
            imports: [ PaginationComponent],
            providers: [],
        }).compileComponents();

        fixture = TestBed.createComponent(PaginationComponent);
        
        fixture.componentRef.setInput('currentPage', 1);
        fixture.componentRef.setInput('pageSize', 10);
        fixture.componentRef.setInput('totalPages', 5);
        
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('builds the component successfully', () => {
        expect(component).toBeTruthy();
    });

    it('should be accessible', async () => {
        const n = fixture.nativeElement;
        expect(await(axe.run(n))).toHaveNoViolations();
    });
});

