import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { UsuarioInicioComponent } from './pages/usuario-inicio/usuario-inicio.component';
import { ClienteInicioComponent } from './pages/cliente-inicio/cliente-inicio.component';
import { PaginaNoEncontradaComponent } from './pages/pagina-no-encontrada/pagina-no-encontrada.component';
import { TransportistaInicioComponent } from './pages/transportista-inicio/transportista-inicio.component';
import { ProveedorInicioComponent } from './pages/proveedor-inicio/proveedor-inicio.component';
import { ProductoInicioComponent } from './pages/producto-inicio/producto-inicio.component';
import { ProductoComponent } from './pages/producto-inicio/producto/producto.component';
import { ClienteComponent } from './pages/cliente-inicio/cliente/cliente.component';
import { UsuarioComponent } from './pages/usuario-inicio/usuario/usuario.component';
import { TransportistaComponent } from './pages/transportista-inicio/transportista/transportista.component';
import { ProveedorComponent } from './pages/proveedor-inicio/proveedor/proveedor.component';

export const routes: Routes = [
    {path: 'home', component: InicioComponent, title: 'Supermercado Paradisia'},
    {path: 'usuario', component: UsuarioInicioComponent, title: 'Usuarios', children: [{
        path: 'usuario-detalle', component: UsuarioComponent, title: 'Información del Usuario'
    }]},
    {path: 'cliente', component: ClienteInicioComponent, title: 'Clientes', children: [{
        path: 'cliente-detalle', component: ClienteComponent, title: 'Información del Cliente'
    }]},
    {path: 'transportista', component: TransportistaInicioComponent, title: 'Transportistas', children: [{
        path: 'transportista-detalle', component: TransportistaComponent, title: 'Información del Transportista'
    }]},
    {path: 'proveedor', component: ProveedorInicioComponent, title: 'Proveedor', children: [{
        path: 'proveedor-detalle', component: ProveedorComponent, title: 'Información del Proveedor'
    }]},
    {path: 'producto', component: ProductoInicioComponent, title: 'Productos', children: [{
        path: 'producto-detalle', component: ProductoComponent, title: 'Información del Producto'
    }]},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: '**', component: PaginaNoEncontradaComponent}

];
