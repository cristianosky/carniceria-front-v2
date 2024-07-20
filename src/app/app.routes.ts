import { Routes } from '@angular/router';
import { Dashboard2Component } from './modules/dashboard2/dashboard2.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login'
    },

    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {   
                path: 'dashboard', 
                component: Dashboard2Component,
                title: 'Dashboard'
            },
        
            {
                path: 'facturar',
                loadChildren: () => import('./modules/facturar/facturar.module').then(m => m.FacturarModule),
                title: 'Facturar',
            },
        
            {
                path: 'inventario',
                loadChildren: () => import('./modules/inventario/inventario.module').then(m => m.InventarioModule),
                title: 'Inventario',
            },
        
            {
                path: 'producto',
                loadChildren: () => import('./modules/producto/producto.module').then(m => m.ProductoModule),
                title: 'Producto',
            },
        ]
    }

];
