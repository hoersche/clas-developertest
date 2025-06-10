import {Component, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {ToastrService} from 'ngx-toastr';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import {FormsModule} from '@angular/forms';
import {SpinnerModule} from '@uiowa/spinner';
import {BehaviorSubject, combineLatestWith, Observable, switchMap} from 'rxjs';

import {AsyncPipe} from '@angular/common';
import {Order} from "src/api/orders/models/order";
import {CreateOrderRequest} from "src/api/orders/models/create-order-request";
import {OrderService} from "src/api/orders/order.service";
import {PaginatedResult} from "../../../api/common/paginated-result";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {PaginationComponent} from "../../core/components/pagination";


@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css'],
    imports: [SpinnerModule, FormsModule, AsyncPipe, FaIconComponent, PaginationComponent, FormsModule]
})
export class OrdersComponent {
    protected orders$: Observable<PaginatedResult<Order>>;
    selectedOrder: Order;
    createOrderRequest = new CreateOrderRequest('');
    private modalRef: NgbModalRef;

    protected readonly pageNumber = signal(1);
    protected readonly pageSize = signal<number>(20);
    private readonly orderReloader = new BehaviorSubject<void>(null);
    protected spinnerIcon = faSpinner;

    constructor(
        private readonly orderService: OrderService,
        private readonly toastr: ToastrService,
        private readonly modalService: NgbModal
    ) {
        
        const pageNumber$ = toObservable(this.pageNumber);
        const pageSize$ = toObservable(this.pageSize);
        
        this.orders$ = pageNumber$.pipe(
            combineLatestWith(pageSize$, this.orderReloader),
            switchMap(([pageNumber, pageSize]) => this.orderService.getOrders(pageNumber, pageSize)),
        );
    }

    open(content, order: Order) {
        this.selectedOrder = order;
        this.modalRef = this.modalService.open(content);
        this.modalRef.result.then(result => {
        }, reason => {
        });
    }

    deleteOrder() {
        const orderId = this.selectedOrder.id;
        this.orderService.deleteOrder(orderId).subscribe(() => {
            this.reloadOrders();
            this.toastr.success(`Order #${orderId} is removed.`);
            this.modalRef.close();
            this.selectedOrder = null;
        });
    }

    addOrder() {
        const errorMsg = this.createOrderRequest.validate();
        if (errorMsg) {
            this.toastr.error(errorMsg);
            return;
        }
        this.orderService.createOrder(this.createOrderRequest).subscribe(x => {
            this.reloadOrders();
            this.createOrderRequest = new CreateOrderRequest('');
            this.toastr.success(`New order created.`);
        });
    }

    reloadOrders() {
        this.orderReloader.next();
    }
}
