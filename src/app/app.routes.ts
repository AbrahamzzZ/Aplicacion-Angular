import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { UsuarioInicioComponent } from './pages/usuario-inicio/usuario-inicio.component';
import { ClienteInicioComponent } from './pages/cliente-inicio/cliente-inicio.component';
import { PaginaNoEncontradaComponent } from './pages/pagina-no-encontrada/pagina-no-encontrada.component';
import { TransportistaInicioComponent } from './pages/transportista-inicio/transportista-inicio.component';
import { RegistroProveedorInicioComponent } from './pages/proveedor-inicio/proveedor-inicio.component';
import { RegistroProductoInicioComponent } from './pages/producto-inicio/producto-inicio.component';
import { ProductoComponent } from './pages/producto-inicio/registro-producto/registro-producto.component';
import { RegistroClienteComponent } from './pages/cliente-inicio/registro-cliente/registro-cliente.component';
import { RegistroUsuarioComponent } from './pages/usuario-inicio/registro-usuario/registro-usuario.component';
import { RegistroTransportistaComponent } from './pages/transportista-inicio/registro-transportista/registro-transportista.component';
import { ProveedorComponent } from './pages/proveedor-inicio/registro-proveedor/registro-proveedor.component';

export const routes: Routes = [
    /*{path: 'home', component: InicioComponent, title: 'Supermercado Paradisia'},
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
    {path: '**', component: PaginaNoEncontradaComponent}*/
    {path: 'home', component: InicioComponent, title: 'Supermercado Paradisia'},
    {path: 'usuario', component: UsuarioInicioComponent, title: 'Usuarios'},
    {path: 'usuario/usuario-registro', component: RegistroUsuarioComponent, title: 'Información del Usuario'},
    {path: 'cliente', component: ClienteInicioComponent, title: 'Clientes'},
    {path: 'cliente/cliente-registro', component: RegistroClienteComponent, title: 'Información del Cliente'},
    {path: 'transportista', component: TransportistaInicioComponent, title: 'Transportistas'},
    {path: 'transportista/transportista-registro', component: RegistroTransportistaComponent, title: 'Información del Transportista'},
    {path: 'proveedor', component: RegistroProveedorInicioComponent, title: 'Proveedor'},
    {path: 'proveedor/proveedor-registro', component: ProveedorComponent, title: 'Información del Proveedor'},
    {path: 'producto', component: RegistroProductoInicioComponent, title: 'Productos'},
    {path: 'producto/producto-registro', component: ProductoComponent, title: 'Información del Producto'},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: '**', component: PaginaNoEncontradaComponent, title: 'Pagina no existente'}
];
