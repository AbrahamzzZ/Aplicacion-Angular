import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { UsuarioInicioComponent } from './pages/usuario-inicio/usuario-inicio.component';
import { ClienteInicioComponent } from './pages/cliente-inicio/cliente-inicio.component';
import { PaginaNoEncontradaComponent } from './pages/pagina-no-encontrada/pagina-no-encontrada.component';
import { TransportistaInicioComponent } from './pages/transportista-inicio/transportista-inicio.component';
import { ProveedorInicioComponent } from './pages/proveedor-inicio/proveedor-inicio.component';
import { ProductoInicioComponent } from './pages/producto-inicio/producto-inicio.component';

export const routes: Routes = [
    {path: 'home', component: InicioComponent, title: 'Supermercado Paradisia'},
    {path: 'usuario', component: UsuarioInicioComponent, title: 'Usuarios'},
    {path: 'cliente', component: ClienteInicioComponent, title: 'Clientes'},
    {path: 'transportista', component: TransportistaInicioComponent, title: 'Transportistas'},
    {path: 'proveedor', component: ProveedorInicioComponent, title: 'Proveedor'},
    {path: 'producto', component: ProductoInicioComponent, title: 'Productos'},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: '**', component: PaginaNoEncontradaComponent}

];
