import {ComponentFixture, TestBed} from '@angular/core/testing';
import {OrdersComponent} from './orders.component';
import * as axe from "axe-core";
import {OrderService} from 'src/api/orders/order.service';
import {ToastrService} from "ngx-toastr";
import {of} from "rxjs";
import {AsyncPipe} from '@angular/common';

describe('OrdersComponent', () => {
    let component: OrdersComponent;
    let fixture: ComponentFixture<OrdersComponent>;
    let mockOrderService: jasmine.SpyObj<OrderService>;
    let mockToastrService: jasmine.SpyObj<ToastrService>;
    beforeEach(async () => {
        mockOrderService = jasmine.createSpyObj('OrderService', ['getOrders', 'deleteOrder']);
        mockOrderService.getOrders.and.returnValue(of({
            items: [{
                id: 1,
                description: 'test',
                createdAt: Date(),
                createdBy: 'test'
            }],
            pageNumber: 1,
            totalCount: 1,
            totalPages: 1
        }));
        mockToastrService = jasmine.createSpyObj('ToastrService', ['showToast']);
        await TestBed.configureTestingModule({
            imports: [AsyncPipe, OrdersComponent],
            providers: [
                {provide: OrderService, useValue: mockOrderService},
                {provide: ToastrService, useValue: mockToastrService},
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(OrdersComponent);
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


    it('should show orders table', async () => {
        const table = fixture.nativeElement.querySelector('table');
        expect(table).toBeTruthy();
    });

});