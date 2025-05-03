import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ModalProveedorComponent } from '../../modal/modal-proveedor/modal-proveedor.component';
import { IProveedor } from '../../models/proveedor';
import { MatDialog } from '@angular/material/dialog';
import { ITransportista } from '../../models/transportista';
import { ModalTransportistaComponent } from '../../modal/modal-transportista/modal-transportista.component';
import { IProducto } from '../../models/producto';
import { ModalProductoComponent } from '../../modal/modal-producto/modal-producto.component';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IDetalleCompra } from '../../models/detalle-compra';
import { ICompra } from '../../models/compra';
import { CompraService } from '../../../services/compra.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../../services/login.service';
import { Metodos } from '../../../utility/metodos';
import { IUsuario } from '../../models/usuario';

@Component({
  selector: 'app-compra-inicio',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatSelectModule, FormsModule, MatFormFieldModule, MatInputModule , MatTableModule, MatIcon],
  templateUrl: './compra-inicio.component.html',
  styleUrl: './compra-inicio.component.scss'
})
export class CompraInicioComponent implements OnInit{
  public hoy = new Date().toISOString().substring(0, 10);
  public tipoComprobante: string = 'Boleta';
  public proveedorSeleccionado: IProveedor | null = null;
  public transportistaSeleccionado: ITransportista | null = null;
  public productoSeleccionado: IProducto | null = null;
  public producto = { precioVenta: 0, precioCompra: 0, cantidad: 0, subTotal: 0 };
  public productosAgregados: any[] = [];
  public dataSource = new MatTableDataSource<any>();
  public columnasTabla: string[] = ['ID', 'nombre', 'precioCompra', 'precioVenta', 'cantidad', 'subtotal', 'accion'];
  private servicioCompra = inject(CompraService);
  private snackBar = inject(MatSnackBar);
  private loginServicio = inject(LoginService);
  public numeroDocumento: string = '';

  constructor(private router: Router, private dialogo: MatDialog){}

  ngOnInit(): void {
    this.obtenerNumeroDocumento();
  }

  abrirModalProveedores() {
    const dialogRef = this.dialogo.open(ModalProveedorComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe((result: IProveedor) => {
      if (result) {
        this.proveedorSeleccionado = result;
      }
    });
  }

  abrirModalTransportistas() {
    const dialogRef = this.dialogo.open(ModalTransportistaComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe((result: ITransportista) => {
      if (result) {
        this.transportistaSeleccionado = result;
      }
    });
  }

  abrirModalProductos() {
    const dialogRef = this.dialogo.open(ModalProductoComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe((result: IProducto) => {
      if (result) {
        this.productoSeleccionado = result;
      }
    });
  }

  verDetalleCompra(){
    this.router.navigate(['compra/detalle-compra']);
  }

  obtenerNumeroDocumento() {
    this.servicioCompra.obtenerNuevoNumeroDocumento().subscribe(response => {
      this.numeroDocumento = response.numeroDocumento;
    });
  }

  agregarProducto() {
    if (this.productoSeleccionado && this.producto.cantidad > 0 && this.producto.precioCompra > 0) {
      const subtotalCalculado = Number(this.producto.precioCompra) * Number(this.producto.cantidad);
      const productoAgregado = {
        id: this.productoSeleccionado.id,
        nombre: this.productoSeleccionado.nombre,
        precioCompra: Number(this.producto.precioCompra),
        precioVenta: Number(this.producto.precioVenta),
        cantidad: this.producto.cantidad,
        subtotal: subtotalCalculado
      };
      
      this.productosAgregados.push(productoAgregado);
      this.dataSource.data = [...this.productosAgregados]; // Actualizar el dataSource
      console.log(productoAgregado);

      this.productoSeleccionado = null;
      this.producto = { precioVenta: 0, precioCompra: 0, cantidad: 0, subTotal: 0 };
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
    if (!this.proveedorSeleccionado || !this.transportistaSeleccionado) {
      this.mostrarMensaje('Debe seleccionar un proveedor y un transportista.', 'error');
      return;
    }else if(this.productosAgregados.length === 0){
      this.mostrarMensaje('Debe agregar al menos un producto.', 'error');
      return;
    }

    const detalles: IDetalleCompra[] = this.productosAgregados.map(p => ({
      idProducto: p.id,
      Precio_Compra: Number(p.precioCompra),
      Precio_Venta: Number(p.precioVenta),
      cantidad: p.cantidad,
      SubTotal: p.subtotal
    }));

    const datosToken = this.loginServicio.obtenerDatosToken();

    const compra: ICompra = {
      id: 0, 
      numeroDocumento: this.numeroDocumento,
      oUsuario: {
        id: Number(datosToken?.nameid),
        nombre_Completo: datosToken?.unique_name
      } as IUsuario, 
      oProveedor: this.proveedorSeleccionado,
      oTransportista: this.transportistaSeleccionado,
      tipoDocumento: this.tipoComprobante,
      montoTotal: this.calcularTotal().toFixed(2),
      detalleCompra: detalles,
      fecha_Compra: Metodos.getFechaCreacion()
    };
    console.log(compra);
    this.servicioCompra.registrar(compra).subscribe(response => {
      if (response.isSuccess) {
        this.mostrarMensaje('¡Compra registrada exitosamente!', 'success');
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

  limpiar(){
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
