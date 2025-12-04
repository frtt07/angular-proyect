import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { AuthenticationGuard } from 'src/app/guards/authentication.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    {
        path: '',
        children: [
            {
                path: 'theaters',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/theaters/theaters.module').then(m => m.TheatersModule)
            }
        ]
    },
    { path: 'products', loadChildren: () => import('../../pages/products/products.module').then(m => m.ProductsModule) },
    { path: 'customers', loadChildren: () => import('../../pages/customers/customers.module').then(m => m.CustomersModule) },
    { path: 'restaurants', loadChildren: () => import('../../pages/restaurants/restaurants.module').then(m => m.RestaurantsModule) },
    { path: 'menus', loadChildren: () => import('../../pages/menus/menus.module').then(m => m.MenusModule) },
    { path: 'drivers', loadChildren: () => import('../../pages/drivers/drivers.module').then(m => m.DriversModule) },
    { path: 'motorcycles', loadChildren: () => import('../../pages/motorcycles/motorcycles.module').then(m => m.MotorcyclesModule) },
    { path: 'shifts', loadChildren: () => import('../../pages/shifts/shifts.module').then(m => m.ShiftsModule) },
    { path: 'orders', loadChildren: () => import('../../pages/orders/orders.module').then(m => m.OrdersModule) },
    { path: 'addresses', loadChildren: () => import('../../pages/addresses/addresses.module').then(m => m.AddressesModule) },
    { path: 'issues', loadChildren: () => import('../../pages/issues/issues.module').then(m => m.IssuesModule) },
    { path: 'photos', loadChildren: () => import('../../pages/photos/photos.module').then(m => m.PhotosModule) },
];
