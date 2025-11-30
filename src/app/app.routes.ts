import { Routes } from '@angular/router';
import { Store } from './store/store';
import { Inicio } from './store/inicio/inicio';
import { Carrito } from './store/carrito/carrito';
import { Catalogo } from './store/catalogo/catalogo';
import { Login } from './store/login/login';
import { Pedidos } from './store/pedidos/pedidos';
import { Register } from './store/register/register';
import { Usuario } from './store/usuario/usuario';
import { Detalles } from './store/detalles/detalles';

export const routes: Routes = [
    {
        path: '', redirectTo: 'store/inicio', pathMatch: 'full'
    },
    {
        path: 'store', component: Store, children: [
            { path: 'inicio', component: Inicio },
            { path: 'carrito', component: Carrito },
            { path: 'catalogo', component: Catalogo },
            { path: 'login', component: Login },
            { path: 'pedidos', component: Pedidos },
            { path: 'register', component: Register },
            { path: 'usuario', component: Usuario },
            { path: 'detalles/:id', component: Detalles }
        ]
    },
    { path: '**', redirectTo: 'store/inicio' },
];
