import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { IProducto } from '../../interfaces/producto';
import { LoginService } from '../../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentaService } from '../../../services/venta.service';
import { ModalClienteComponent } from '../../components/modal/modal-cliente/modal-cliente.component';
import { ICliente } from '../../interfaces/cliente';
import { ModalOfertaComponent } from '../../components/modal/modal-oferta/modal-oferta.component';
import { IOferta } from '../../interfaces/oferta';
import { ModalProductoComponent } from '../../components/modal/modal-producto/modal-producto.component';
import { Router } from '@angular/router';
import { IUsuario } from '../../interfaces/usuario';
import { Metodos } from '../../../utility/metodos';
import { IVenta } from '../../interfaces/venta';
import { IDetalleVenta } from '../../interfaces/detalle-venta';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-venta-inicio',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatSelectModule, FormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIcon, CurrencyPipe],
  templateUrl: './venta-inicio.component.html',
  styleUrl: './venta-inicio.component.scss'
})
export class VentaInicioComponent {
  public hoy = new Date().toISOString().substring(0, 10);
  public tipoComprobante: string = 'Boleta';
  public clienteSeleccionado: ICliente | null = null;
  public ofertaSeleccionado: IOferta | null = null;
  public productoSeleccionado: IProducto | null = null;
  public producto = { precioVenta: 0, cantidad: 0, subTotal: 0, descuento: 0 };
  public productosAgregados: any[] = [];
  public dataSource = new MatTableDataSource<any>();
  public columnasTabla: string[] = ['ID', 'nombre', 'precioVenta', 'cantidad', 'subtotal', 'descuento', 'accion'];
  private servicioVenta = inject(VentaService);
  private snackBar = inject(MatSnackBar);
  private loginServicio = inject(LoginService);
  public numeroDocumento: string = '';
  public totalSinDescuento: number = 0;
  public pagaCon: number = 0;
  public cambio: number = 0;
  public totalConDescuento: number = 0;
  public montoDescuento: number = 0;


  constructor(private router: Router, private dialogo: MatDialog){}

  ngOnInit(): void {
    this.obtenerNumeroDocumento();
  }

  abrirModalClientes() {
    const dialogRef = this.dialogo.open(ModalClienteComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe((result: ICliente) => {
      if (result) {
        this.clienteSeleccionado = result;
      }
    });
  }

  abrirModalOfertas() {
    const dialogRef = this.dialogo.open(ModalOfertaComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe((result: IOferta) => {
      if (result) {
        this.ofertaSeleccionado = result;
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

  verDetalleVenta(){
    this.router.navigate(['venta/detalle-venta']);
  }

  obtenerNumeroDocumento() {
    this.servicioVenta.obtenerNuevoNumeroDocumento().subscribe(response => {
      this.numeroDocumento = response.numeroDocumento;
    });
  }

  agregarProducto() {
    if (this.productoSeleccionado && this.producto.cantidad > 0) {
      
      if (!Number.isInteger(this.producto.cantidad)) {
        this.mostrarMensaje('La cantidad debe ser un número entero.', 'error');
        return;
      }
      
      if(this.producto.cantidad <= this.productoSeleccionado.stock){
        const precioVenta = Number(this.productoSeleccionado.precio_Venta);
        const cantidad = Number(this.producto.cantidad);
        const descuento = this.ofertaSeleccionado?.descuento ?? 0;
    
        const subtotal = precioVenta * cantidad;
        const montoDescuento = subtotal * (descuento / 100);
        const subtotalConDescuento = subtotal - montoDescuento;
    
        const productoAgregado = {
          id: this.productoSeleccionado.id,
          nombre: this.productoSeleccionado.nombre,
          precioVenta: precioVenta,
          cantidad: cantidad,
          descuento: descuento,
          subtotal: subtotalConDescuento
        };
    
        this.productosAgregados.push(productoAgregado);
        this.dataSource.data = [...this.productosAgregados];
    
        this.calcularTotal();
        this.productoSeleccionado = null;
        this.ofertaSeleccionado = null;
        this.producto.cantidad = 0;
      }else{
        this.mostrarMensaje('La cantidad supera al stock del producto.', 'error');
      }
    }else{
      this.mostrarMensaje('No se acepta cantidades negativas.', 'error');
    }
  }

  eliminarProducto(index: number) {
    this.productosAgregados.splice(index, 1);
    this.dataSource.data = [...this.productosAgregados];
    this.calcularTotal();
  }

  calcularTotal() {
    const total = this.productosAgregados.reduce((acc, item) => acc + (item.precioVenta * item.cantidad), 0);
    const descuento = this.ofertaSeleccionado?.descuento || 0;
    const montoDescuento = total * (descuento / 100);
    const totalConDescuento = total - montoDescuento;
  
    this.totalSinDescuento = total;
    this.totalConDescuento = totalConDescuento;
    this.montoDescuento = montoDescuento;
  
    return totalConDescuento;
  }

  calcularCambio() {
    this.calcularTotal();

    if (!isNaN(this.pagaCon)) {

      if (this.pagaCon < 0) {
        this.mostrarMensaje('No se permiten valores negativos en "Paga con".', 'error');
        this.cambio = 0;
      }else{

        if (this.pagaCon < this.totalConDescuento) {
          this.mostrarMensaje('El monto ingresado en "Paga con" es insuficiente.', 'error');
          this.cambio = 0;
        } else {
          this.cambio = this.pagaCon - this.totalConDescuento;
        }
        
      }

    }else{
      this.mostrarMensaje('Debe ingresar un número válido en "Paga con".', 'error');
      this.cambio = 0;
    }
  }  

  mostrarTotal(){
    return this.totalSinDescuento;
  }

  registrarVenta() {
    if (!this.clienteSeleccionado) {
      this.mostrarMensaje('Debe seleccionar un cliente.', 'error');
      return;
    }else if(this.productosAgregados.length === 0){
      this.mostrarMensaje('Debe agregar al menos un producto.', 'error');
      return;
    }

    const detalles: IDetalleVenta[] = this.productosAgregados.map(p => ({
      idProducto: p.id,
      Precio_Venta: Number(p.precioVenta),
      cantidad: p.cantidad,
      SubTotal: p.subtotal,
      descuento: p.descuento
    }));

    const datosToken = this.loginServicio.obtenerDatosToken();

    const venta: IVenta = {
      id: 0, 
      numeroDocumento: this.numeroDocumento,
      oUsuario: {
        id: Number(datosToken?.nameid),
        nombre_Completo: datosToken?.unique_name
      } as IUsuario, 
      oCliente: this.clienteSeleccionado,
      oOferta: this.ofertaSeleccionado,
      tipoDocumento: this.tipoComprobante,
      montoTotal: this.totalSinDescuento,
      montoCambio: this.cambio,
      montoPago: this.pagaCon,
      descuento: this.totalConDescuento,
      detalleVenta: detalles,
      fecha_Venta: Metodos.getFechaCreacion()
    };
    console.log(venta);
    this.servicioVenta.registrar(venta).subscribe(response => {
      if (response.isSuccess) {
        this.mostrarMensaje('¡Venta registrada exitosamente!', 'success');
        this.limpiar();
        this.router.navigate(['/venta']);

      } else {
         this.mostrarMensaje('Error al registrar la venta', 'error');
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
    this.clienteSeleccionado = null;
    this.ofertaSeleccionado = null;
    this.productoSeleccionado = null;

    this.producto = {
      precioVenta: 0,
      cantidad: 0,
      subTotal: 0,
      descuento: 0
    };

    this.tipoComprobante = 'Boleta';

    this.productosAgregados = [];
    this.dataSource.data = [];
  }
}
