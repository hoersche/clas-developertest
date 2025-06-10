import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {HomeComponent} from './home.component';
import * as axe from "axe-core";
import {ToastrService} from "ngx-toastr";
import {AsyncPipe} from '@angular/common';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    beforeEach(async () => {
      
        await TestBed.configureTestingModule({
            imports: [AsyncPipe, HomeComponent],
            providers: [
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
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