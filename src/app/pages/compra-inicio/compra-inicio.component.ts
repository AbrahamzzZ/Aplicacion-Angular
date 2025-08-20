import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ModalProveedorComponent } from '../../components/modal/modal-proveedor/modal-proveedor.component';
import { IProveedor } from '../../interfaces/proveedor';
import { MatDialog } from '@angular/material/dialog';
import { ITransportista } from '../../interfaces/transportista';
import { ModalTransportistaComponent } from '../../components/modal/modal-transportista/modal-transportista.component';
import { IProducto } from '../../interfaces/producto';
import { ModalProductoComponent } from '../../components/modal/modal-producto/modal-producto.component';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IDetalleCompra } from '../../interfaces/detalle-compra';
import { ICompra } from '../../interfaces/compra';
import { CompraService } from '../../../services/compra.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../../services/login.service';
import { DialogoNumeroDocumentoComponent } from '../../components/dialog/dialogo-numero-documento/dialogo-numero-documento.component';
import { ISucursal } from '../../interfaces/sucursal';
import { ModalSucursalComponent } from '../../components/modal/modal-sucursal/modal-sucursal.component';

@Component({
  selector: 'app-compra-inicio',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIcon
  ],
  templateUrl: './compra-inicio.component.html',
  styleUrl: './compra-inicio.component.scss'
})
export class CompraInicioComponent implements OnInit {
  private servicioCompra = inject(CompraService);
  private snackBar = inject(MatSnackBar);
  private loginServicio = inject(LoginService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  public hoy = new Date().toISOString().substring(0, 10);
  public tipoComprobante = 'Boleta';
  public proveedorSeleccionado: IProveedor | null = null;
  public transportistaSeleccionado: ITransportista | null = null;
  public productoSeleccionado: IProducto | null = null;
  public sucursalSelecionada: ISucursal | null = null;
  public producto = { precioVenta: 0, precioCompra: 0, cantidad: 0, subTotal: 0 };
  public productosAgregados: any[] = [];
  public dataSource = new MatTableDataSource<any>();
  public columnasTabla: string[] = [
    'ID',
    'nombre',
    'precioCompra',
    'precioVenta',
    'cantidad',
    'subtotal',
    'accion'
  ];
  public numeroDocumento = '';

  ngOnInit(): void {
    this.obtenerNumeroDocumento();
  }

  abrirModalSucursales() {
    const dialogoRef = this.dialog.open(ModalSucursalComponent, {
      width: '800px'
    });

    dialogoRef.afterClosed().subscribe((result: ISucursal) => {
      if (result) {
        this.sucursalSelecionada = result;
      }
    });
  }

  abrirModalProveedores() {
    const dialogRef = this.dialog.open(ModalProveedorComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe((result: IProveedor) => {
      if (result) {
        this.proveedorSeleccionado = result;
      }
    });
  }

  abrirModalTransportistas() {
    const dialogRef = this.dialog.open(ModalTransportistaComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe((result: ITransportista) => {
      if (result) {
        this.transportistaSeleccionado = result;
      }
    });
  }

  abrirModalProductos() {
    const dialogRef = this.dialog.open(ModalProductoComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe((result: IProducto) => {
      if (result) {
        this.productoSeleccionado = result;
      }
    });
  }

  verDetalleCompra() {
    this.router.navigate(['compra/detalle-compra']);
  }

  obtenerNumeroDocumento() {
    this.servicioCompra.obtenerNuevoNumeroDocumento().subscribe({
      next: (resp: any) => {
        this.numeroDocumento = resp.data;
      }
    });
  }

  agregarProducto() {
    if (this.productoSeleccionado && this.producto.cantidad > 0) {
      if (
        !isNaN(this.productoSeleccionado.precio_Compra ?? 0) &&
        !isNaN(this.productoSeleccionado.precio_Venta ?? 0) &&
        this.producto.precioCompra > 0 &&
        this.producto.precioVenta > 0
      ) {
        if (!Number.isInteger(this.producto.cantidad)) {
          this.mostrarMensaje('La cantidad debe ser un número entero.', 'error');
          return;
        }

        const subtotalCalculado =
          Number(this.producto.precioCompra) * Number(this.producto.cantidad);
        const productoAgregado = {
          id: this.productoSeleccionado.id_Producto,
          nombre: this.productoSeleccionado.nombre_Producto,
          precioCompra: Number(this.producto.precioCompra),
          precioVenta: Number(this.producto.precioVenta),
          cantidad: this.producto.cantidad,
          subtotal: subtotalCalculado
        };

        this.productosAgregados.push(productoAgregado);
        this.dataSource.data = [...this.productosAgregados];

        this.productoSeleccionado = null;
        this.producto = { precioVenta: 0, precioCompra: 0, cantidad: 0, subTotal: 0 };
      } else {
        this.mostrarMensaje('El precio debe ser un número válido.', 'error');
      }
    } else {
      this.mostrarMensaje('No se acepta cantidades negativas.', 'error');
    }
  }

  eliminarProducto(index: number) {
    this.productosAgregados.splice(index, 1);
    this.dataSource.data = [...this.productosAgregados];
  }

  calcularTotal() {
    return this.productosAgregados.reduce((acc, p) => acc + p.precioCompra * p.cantidad, 0);
  }

  registrarCompra() {
    if (!this.proveedorSeleccionado) {
      this.mostrarMensaje('Debe seleccionar un proveedor.', 'error');
      return;
    } else if (!this.transportistaSeleccionado) {
      this.mostrarMensaje('Debe seleccionar un transportista.', 'error');
      return;
    } else if (!this.sucursalSelecionada) {
      this.mostrarMensaje('Debe seleccionar una sucursal.', 'error');
      return;
    } else if (this.productosAgregados.length === 0) {
      this.mostrarMensaje('Debe agregar al menos un producto.', 'error');
      return;
    }

    const detalles: IDetalleCompra[] = this.productosAgregados.map((p) => ({
      id_Producto: p.id,
      precio_Compra: Number(p.precioCompra),
      precio_Venta: Number(p.precioVenta),
      cantidad: p.cantidad,
      subTotal: p.subtotal
    }));

    const datosToken = this.loginServicio.obtenerDatosToken();

    const compra: ICompra = {
      id: 0,
      numero_Documento: this.numeroDocumento,
      id_Usuario: Number(datosToken?.nameid),
      id_Sucursal: this.sucursalSelecionada.id_Sucursal,
      id_Proveedor: this.proveedorSeleccionado.id_Proveedor,
      id_Transportista: this.transportistaSeleccionado.id_Transportista,
      tipo_Documento: this.tipoComprobante,
      monto_Total: this.calcularTotal().toFixed(2),
      detalles: detalles
    };

    this.servicioCompra.registrar(compra).subscribe((response) => {
      if (response.isSuccess) {
        this.mostrarMensaje('¡Compra registrada exitosamente!', 'success');
        this.dialog.open(DialogoNumeroDocumentoComponent, {
          width: '400px',
          data: { numeroDocumento: this.numeroDocumento }
        });
        this.limpiar();
        this.router.navigate(['/compra']);
      } else {
        this.mostrarMensaje('Error al registrar la compra', 'error');
      }
    });
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' = 'success') {
    const className = tipo === 'success' ? 'success-snackbar' : 'error-snackbar';

    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: [className]
    });
  }

  limpiar() {
    this.proveedorSeleccionado = null;
    this.transportistaSeleccionado = null;
    this.productoSeleccionado = null;

    this.producto = {
      precioVenta: 0,
      precioCompra: 0,
      cantidad: 0,
      subTotal: 0
    };

    this.tipoComprobante = 'Boleta';

    this.productosAgregados = [];
    this.dataSource.data = [];
  }
}
