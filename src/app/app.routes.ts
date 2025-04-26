import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { UsuarioInicioComponent } from './pages/usuario-inicio/usuario-inicio.component';
import { ClienteInicioComponent } from './pages/cliente-inicio/cliente-inicio.component';
import { PaginaNoEncontradaComponent } from './pages/pagina-no-encontrada/pagina-no-encontrada.component'; 
import { TransportistaInicioComponent } from './pages/transportista-inicio/transportista-inicio.component';
import { ProveedorInicioComponent } from './pages/proveedor-inicio/proveedor-inicio.component';
import { ProductoInicioComponent } from './pages/producto-inicio/producto-inicio.component';
import { RegistroProductoComponent } from './pages/producto-inicio/registro-producto/registro-producto.component';
import { RegistroClienteComponent } from './pages/cliente-inicio/registro-cliente/registro-cliente.component';
import { RegistroUsuarioComponent } from './pages/usuario-inicio/registro-usuario/registro-usuario.component';
import { RegistroTransportistaComponent } from './pages/transportista-inicio/registro-transportista/registro-transportista.component';
import { RegistroProveedorComponent } from './pages/proveedor-inicio/registro-proveedor/registro-proveedor.component';
import { ProductoEditarComponent } from './pages/producto-inicio/producto-editar/producto-editar.component';
import { EditarProveedorComponent } from './pages/proveedor-inicio/editar-proveedor/editar-proveedor.component';
import { EditarTransportistaComponent } from './pages/transportista-inicio/editar-transportista/editar-transportista.component';
import { EditarUsuarioComponent } from './pages/usuario-inicio/editar-usuario/editar-usuario.component';
import { EditarClienteComponent } from './pages/cliente-inicio/editar-cliente/editar-cliente.component';
import { FormularioIncompleto } from './guards/formulario-incompleto.guard';
import { OfertaInicioComponent } from './pages/oferta-inicio/oferta-inicio.component';
import { RegistroOfertaComponent } from './pages/oferta-inicio/registro-oferta/registro-oferta.component';
import { EditarOfertaComponent } from './pages/oferta-inicio/editar-oferta/editar-oferta.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { Autenticacion } from './guards/autenticacion.guard';
import { RolGuard } from './guards/rol.guard';
import { CategoriaInicioComponent } from './pages/categoria-inicio/categoria-inicio.component';
import { RegistroCategoriaComponent } from './pages/categoria-inicio/registro-categoria/registro-categoria.component';
import { EditarCategoriaComponent } from './pages/categoria-inicio/editar-categoria/editar-categoria.component';
import { CompraInicioComponent } from './pages/compra-inicio/compra-inicio.component';
import { VentaInicioComponent } from './pages/venta-inicio/venta-inicio.component';
import { DetalleCompraComponent } from './pages/compra-inicio/detalle-compra/detalle-compra.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, title: 'Iniciar Sesión' },
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: InicioComponent, canActivate: [Autenticacion], title: 'Inicio' },
      { path: 'usuario', component: UsuarioInicioComponent, canMatch: [RolGuard],canActivate: [Autenticacion], title: 'Usuarios' },
      { path: 'usuario/usuario-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroUsuarioComponent, title: 'Registro de Usuarios' },
      { path: 'usuario/usuario-editar/:id', canActivate: [Autenticacion], component: EditarUsuarioComponent, title: 'Editar Usuario' },
      { path: 'cliente', component: ClienteInicioComponent, canMatch: [RolGuard], canActivate: [Autenticacion], title: 'Clientes'},
      { path: 'cliente/cliente-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroClienteComponent, title: 'Registro de Clientes' },
      { path: 'cliente/cliente-editar/:id', canActivate: [Autenticacion], component: EditarClienteComponent, title: 'Editar Cliente' },
      { path: 'transportista', component: TransportistaInicioComponent, canMatch: [RolGuard], canActivate: [Autenticacion], title: 'Transportistas' },
      { path: 'transportista/transportista-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroTransportistaComponent, title: 'Registro de Transportistas' },
      { path: 'transportista/transportista-editar/:id', canActivate: [Autenticacion], component: EditarTransportistaComponent, title: 'Editar Transportista' },
      { path: 'proveedor', component: ProveedorInicioComponent, canMatch: [RolGuard], canActivate: [Autenticacion], title: 'Proveedor' },
      { path: 'proveedor/proveedor-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroProveedorComponent, title: 'Registro de Proveedores' },
      { path: 'proveedor/proveedor-editar/:id', canActivate: [Autenticacion], component: EditarProveedorComponent, title: 'Editar Proveedor' },
      { path: 'categoria', component: CategoriaInicioComponent, canActivate: [Autenticacion], title: 'Categoria'},
      { path: 'categoria/categoria-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroCategoriaComponent, title: 'Registro de Categorías'},
      { path: 'categoria/categoria-editar/:id', canActivate: [Autenticacion], component: EditarCategoriaComponent, title: 'Editar Categoría'},
      { path: 'producto', component: ProductoInicioComponent, canActivate: [Autenticacion], title: 'Producto' },
      { path: 'producto/producto-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroProductoComponent, title: 'Registro de Productos' },
      { path: 'producto/producto-editar/:id', canActivate: [Autenticacion], component: ProductoEditarComponent, title: 'Editar Producto' },
      { path: 'oferta', component: OfertaInicioComponent, canActivate: [Autenticacion], title: 'Oferta' },
      { path: 'oferta/oferta-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroOfertaComponent, title: 'Registro de Ofertas' },
      { path: 'oferta/oferta-editar/:id', canActivate: [Autenticacion], component: EditarOfertaComponent, title: 'Editar Oferta' },
      { path: 'compra', component: CompraInicioComponent, canActivate: [Autenticacion], title: 'Registrar Compras'},
      { path: 'compra/detalle-compra',canActivate: [Autenticacion] , component: DetalleCompraComponent, title: 'Detalle de la compra'},
      { path: 'venta', component: VentaInicioComponent, canActivate: [Autenticacion], title: 'Registrar Ventas'}
    ]
  },
  { path: '**', component: PaginaNoEncontradaComponent, title: 'Página no encontrada' }
];
