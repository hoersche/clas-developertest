import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {OrdersComponent} from "./order/orders/orders.component";
import {RoleGuard} from "./core/guards/role.guard";
import {ImpersonationComponent} from "./core/components/impersonation/impersonation.component";
import {AccessDeniedComponent} from "./core/components/access-denied/access-denied.component";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'orders',
        component: OrdersComponent,

    },
    {
        path: 'other',
        component: OrdersComponent,
    },
    {
        path: 'impersonation',
        component: ImpersonationComponent,
        canActivate: [RoleGuard],
        data: {roles: ['Admin', 'WebMaster']}
    },
    {
        path: 'access-denied',
        component: AccessDeniedComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
