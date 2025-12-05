import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { AuthenticationGuard } from 'src/app/guards/authentication.guard';

export const AdminLayoutRoutes: Routes = [
    // ============================================================
    // RUTAS PROTEGIDAS - Requieren AuthenticationGuard
    // Si el usuario no tiene sesión, será redirigido a /login
    // ============================================================

    // Rutas con componentes directos
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AuthenticationGuard]
    },
    { 
        path: 'user-profile', 
        component: UserProfileComponent,
        canActivate: [AuthenticationGuard]
    },
    { 
        path: 'tables', 
        component: TablesComponent,
        canActivate: [AuthenticationGuard]
    },
    { 
        path: 'icons', 
        component: IconsComponent,
        canActivate: [AuthenticationGuard]
    },
    { 
        path: 'maps', 
        component: MapsComponent,
        canActivate: [AuthenticationGuard]
    },
    
    // ============================================================
    // MÓDULOS LAZY-LOADED - CRUD de entidades
    // Todos protegidos con AuthenticationGuard
    // ============================================================
    
    { 
        path: 'theaters',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('src/app/pages/theaters/theaters.module').then(m => m.TheatersModule)
    },
    { 
        path: 'products',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('../../pages/products/products.module').then(m => m.ProductsModule)
    },
    { 
        path: 'customers',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('../../pages/customers/customers.module').then(m => m.CustomersModule)
    },
    { 
        path: 'restaurants',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('../../pages/restaurants/restaurants.module').then(m => m.RestaurantsModule)
    },
    { 
        path: 'menus',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('../../pages/menus/menus.module').then(m => m.MenusModule)
    },
    { 
        path: 'drivers',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('../../pages/drivers/drivers.module').then(m => m.DriversModule)
    },
    { 
        path: 'motorcycles',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('../../pages/motorcycles/motorcycles.module').then(m => m.MotorcyclesModule)
    },
    { 
        path: 'shifts',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('../../pages/shifts/shifts.module').then(m => m.ShiftsModule)
    },
    { 
        path: 'orders',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('../../pages/orders/orders.module').then(m => m.OrdersModule)
    },
    { 
        path: 'addresses',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('../../pages/addresses/addresses.module').then(m => m.AddressesModule)
    },
    { 
        path: 'issues',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('../../pages/issues/issues.module').then(m => m.IssuesModule)
    },
    { 
        path: 'photos',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('../../pages/photos/photos.module').then(m => m.PhotosModule)
    },
];