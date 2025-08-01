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
import { LoginLayoutComponent } from './components/layouts/login-layout/login-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';
import { Autenticacion } from './guards/autenticacion.guard';
import { RolGuard } from './guards/rol.guard';
import { CategoriaInicioComponent } from './pages/categoria-inicio/categoria-inicio.component';
import { RegistroCategoriaComponent } from './pages/categoria-inicio/registro-categoria/registro-categoria.component';
import { EditarCategoriaComponent } from './pages/categoria-inicio/editar-categoria/editar-categoria.component';
import { CompraInicioComponent } from './pages/compra-inicio/compra-inicio.component';
import { VentaInicioComponent } from './pages/venta-inicio/venta-inicio.component';
import { DetalleCompraComponent } from './pages/compra-inicio/detalle-compra/detalle-compra.component';
import { DetalleVentaComponent } from './pages/venta-inicio/detalle-venta/detalle-venta.component';
import { NegocioInicioComponent } from './pages/negocio-inicio/negocio-inicio.component';
import { SucursalInicioComponent } from './pages/sucursal-inicio/sucursal-inicio.component';
import { RegistrarSucursalComponent } from './pages/sucursal-inicio/registrar-sucursal/registrar-sucursal.component';
import { EditarSucursalComponent } from './pages/sucursal-inicio/editar-sucursal/editar-sucursal.component';
import { EstadisticaNegocioComponent } from './pages/negocio-inicio/estadistica-negocio/estadistica-negocio.component';

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

      //Modulo Usuario
      { path: 'usuario', component: UsuarioInicioComponent, canMatch: [RolGuard],canActivate: [Autenticacion], title: 'Usuarios' },
      { path: 'usuario/usuario-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroUsuarioComponent, title: 'Registro de Usuarios' },
      { path: 'usuario/usuario-editar/:id', canActivate: [Autenticacion], component: EditarUsuarioComponent, title: 'Editar Usuario' },
      
      //Modulo Cliente
      { path: 'cliente', component: ClienteInicioComponent, canMatch: [RolGuard], canActivate: [Autenticacion], title: 'Clientes'},
      { path: 'cliente/cliente-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroClienteComponent, title: 'Registro de Clientes' },
      { path: 'cliente/cliente-editar/:id', canActivate: [Autenticacion], component: EditarClienteComponent, title: 'Editar Cliente' },
      
      //Modulo Transportista
      { path: 'transportista', component: TransportistaInicioComponent, canMatch: [RolGuard], canActivate: [Autenticacion], title: 'Transportistas' },
      { path: 'transportista/transportista-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroTransportistaComponent, title: 'Registro de Transportistas' },
      { path: 'transportista/transportista-editar/:id', canActivate: [Autenticacion], component: EditarTransportistaComponent, title: 'Editar Transportista' },
      
      //Modulo Proveedor
      { path: 'proveedor', component: ProveedorInicioComponent, canMatch: [RolGuard], canActivate: [Autenticacion], title: 'Proveedor' },
      { path: 'proveedor/proveedor-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroProveedorComponent, title: 'Registro de Proveedores' },
      { path: 'proveedor/proveedor-editar/:id', canActivate: [Autenticacion], component: EditarProveedorComponent, title: 'Editar Proveedor' },
      
      //Modulo Categoría
      { path: 'categoria', component: CategoriaInicioComponent, canActivate: [Autenticacion], title: 'Categoria'},
      { path: 'categoria/categoria-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroCategoriaComponent, title: 'Registro de Categorías'},
      { path: 'categoria/categoria-editar/:id', canActivate: [Autenticacion], component: EditarCategoriaComponent, title: 'Editar Categoría'},
      
      //Modulo Producto
      { path: 'producto', component: ProductoInicioComponent, canActivate: [Autenticacion], title: 'Producto' },
      { path: 'producto/producto-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroProductoComponent, title: 'Registro de Productos'},
      { path: 'producto/producto-editar/:id', canActivate: [Autenticacion], component: ProductoEditarComponent, title: 'Editar Producto' },
      
      //Modulo Oferta
      { path: 'oferta', component: OfertaInicioComponent, canActivate: [Autenticacion], title: 'Oferta' },
      { path: 'oferta/oferta-registro/:id', canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], component: RegistroOfertaComponent, title: 'Registro de Ofertas' },
      { path: 'oferta/oferta-editar/:id', canActivate: [Autenticacion], component: EditarOfertaComponent, title: 'Editar Oferta' },
      
      //Modulo Compra
      { path: 'compra', component: CompraInicioComponent, canActivate: [Autenticacion], title: 'Registrar Compras'},
      { path: 'compra/detalle-compra',canActivate: [Autenticacion], component: DetalleCompraComponent, title: 'Ver el detalle de la compra'},
      
      //Modulo Venta
      { path: 'venta', component: VentaInicioComponent, canActivate: [Autenticacion], title: 'Registrar Ventas'},
      { path: 'venta/detalle-venta', canActivate: [Autenticacion], component: DetalleVentaComponent, title: 'Ver el detalle de la venta'},
      
      //Modulo Sucursal
      { path: 'sucursal', component: SucursalInicioComponent, canMatch: [RolGuard], canActivate: [Autenticacion], title: 'Sucursales nacionales'},
      { path: 'sucursal/sucursal-registro/:id', component: RegistrarSucursalComponent, canActivate: [Autenticacion], canDeactivate: [FormularioIncompleto], title: 'Registar Sucursal'},
      { path: 'sucursal/sucursal-editar/:id', component: EditarSucursalComponent, canActivate: [Autenticacion],title: 'Editar Sucursal'},
      
      //Modulo Negocio
      { path: 'negocio/1', component: NegocioInicioComponent, canMatch: [RolGuard], canActivate: [Autenticacion], title: 'Información del negocio'},
      { path: 'negocio/1/estadistica', component: EstadisticaNegocioComponent, canMatch: [RolGuard], canActivate: [Autenticacion], title: 'Estadisticas del negocio'}
    ]
  },
  { path: '**', component: PaginaNoEncontradaComponent, title: 'Página no encontrada' }
];
