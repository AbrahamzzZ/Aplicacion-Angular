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
import { ProductoEditarComponent } from './pages/producto-inicio/producto-editar/producto-editar.component';
import { EditarProveedorComponent } from './pages/proveedor-inicio/editar-proveedor/editar-proveedor.component';
import { EditarTransportistaComponent } from './pages/transportista-inicio/editar-transportista/editar-transportista.component';
import { EditarUsuarioComponent } from './pages/usuario-inicio/editar-usuario/editar-usuario.component';
import { EditarClienteComponent } from './pages/cliente-inicio/editar-cliente/editar-cliente.component';
import { FormularioIncompleto } from './guards/formulario-incompleto.guard';
import { AppComponent } from './app.component';
import { FullScreenLayoutComponent } from './layouts/full-screen-layout/full-screen-layout.component';


export const routes: Routes = [
    {path: 'home', component: InicioComponent, title: 'Supermercado Paradisia'},
    {path: 'usuario', component: UsuarioInicioComponent, title: 'Usuarios'},
    {path: 'usuario/usuario-registro/:id', canDeactivate: [FormularioIncompleto], component: RegistroUsuarioComponent, title: 'Información del Usuario'},
    {path: 'usuario/usuario-editar/:id', component: EditarUsuarioComponent, title: 'Editar usuario'},
    {path: 'cliente', component: ClienteInicioComponent, title: 'Clientes'},
    {path: 'cliente/cliente-registro/:id', canDeactivate: [FormularioIncompleto], component: RegistroClienteComponent, title: 'Información del Cliente'},
    {path: 'cliente/cliente-editar/:id', component: EditarClienteComponent, title: 'Editar cliente'},
    {path: 'transportista', component: TransportistaInicioComponent, title: 'Transportistas'},
    {path: 'transportista/transportista-registro/:id', canDeactivate: [FormularioIncompleto], component: RegistroTransportistaComponent, title: 'Información del Transportista'},
    {path: 'transportista/transportista-editar/:id', component: EditarTransportistaComponent, title: 'Editar transportista'},
    {path: 'proveedor', component: RegistroProveedorInicioComponent, title: 'Proveedor'},
    {path: 'proveedor/proveedor-registro/:id', canDeactivate: [FormularioIncompleto], component: ProveedorComponent, title: 'Información del Proveedor'},
    {path: 'proveedor/proveedor-editar/:id', component:EditarProveedorComponent, title: 'Editar proveedor'},
    {path: 'producto', component: RegistroProductoInicioComponent, title: 'Productos'},
    {path: 'producto/producto-registro/:id', canDeactivate: [FormularioIncompleto], component: ProductoComponent, title: 'Información del Producto'},
    {path: 'producto/producto-editar/:id', component: ProductoEditarComponent, title: 'Editar producto'},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: '**', component: PaginaNoEncontradaComponent, title: 'Pagina no existente'}
    /*{
        path: '', component: AppComponent, children: [
            {path: 'home', component: InicioComponent, title: 'Supermercado Paradisia'},
            {path: 'usuario', component: UsuarioInicioComponent, title: 'Usuarios'},
            {path: 'usuario/usuario-registro/:id', component: RegistroUsuarioComponent, title: 'Información del Usuario'},
            {path: 'usuario/usuario-editar/:id', component: EditarUsuarioComponent, title: 'Editar usuario'},
            {path: 'cliente', component: ClienteInicioComponent, title: 'Clientes'},
            {path: 'cliente/cliente-registro/:id', canDeactivate: [FormularioIncompleto], component: RegistroClienteComponent, title: 'Información del Cliente'},
            {path: 'cliente/cliente-editar/:id', component: EditarClienteComponent, title: 'Editar cliente'},
            {path: 'transportista', component: TransportistaInicioComponent, title: 'Transportistas'},
            {path: 'transportista/transportista-registro/:id', component: RegistroTransportistaComponent, title: 'Información del Transportista'},
            {path: 'transportista/transportista-editar/:id', component: EditarTransportistaComponent, title: 'Editar transportista'},
            {path: 'proveedor', component: RegistroProveedorInicioComponent, title: 'Proveedor'},
            {path: 'proveedor/proveedor-registro/:id', component: ProveedorComponent, title: 'Información del Proveedor'},
            {path: 'proveedor/proveedor-editar/:id', component:EditarProveedorComponent, title: 'Editar proveedor'},
            {path: 'producto', component: RegistroProductoInicioComponent, title: 'Productos'},
            {path: 'producto/producto-registro/:id', component: ProductoComponent, title: 'Información del Producto'},
            {path: 'producto/producto-editar/:id', component: ProductoEditarComponent, title: 'Editar producto'},
            {path: '', redirectTo: '/home', pathMatch: 'full'}
        ]
    },
    {
        path: '**', component: FullScreenLayoutComponent, children:[
            {path: '**', component:PaginaNoEncontradaComponent}
        ],
        title: 'Página no encontrada'
    }*/
];
