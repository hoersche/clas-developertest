import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Order} from './models/order';
import {CreateOrderRequest} from "./models/create-order-request";
import {PaginatedResult} from "../common/paginated-result";

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly api = `api/orders`;

    constructor(private readonly httpClient: HttpClient) {
    }

    getOrders(pageNumber: number, pageSize: number): Observable<PaginatedResult<Order>> {

        const params = new HttpParams({
            fromObject: {
                pageNumber: pageNumber.toString(),
                pageSize: pageSize.toString()
            }
        });
        return this.httpClient.get<PaginatedResult<Order>>(this.api, {params});
    }

    createOrder(request: CreateOrderRequest): Observable<Order> {

        return this.httpClient.post<Order>(this.api, request);
    }

    deleteOrder(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.api}/${id}`);
    }
}
