import { Component } from '@angular/core';
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

@Component({
  selector: 'app-compra-inicio',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatSelectModule, FormsModule, MatFormFieldModule, MatInputModule , MatTableModule, MatIcon],
  templateUrl: './compra-inicio.component.html',
  styleUrl: './compra-inicio.component.scss'
})
export class CompraInicioComponent {
  public hoy = new Date().toISOString().substring(0, 10);
  public tipoComprobante: string = 'boleta';
  public proveedorSeleccionado: IProveedor | null = null;
  public transportistaSeleccionado: ITransportista | null = null;
  public productoSeleccionado: IProducto | null = null;
  public producto = { precioVenta: 0, precioCompra: 0, cantidad: 0, subTotal: 0 };
  public productosAgregados: any[] = [];
  public dataSource = new MatTableDataSource<any>();
  public columnasTabla: string[] = ['ID', 'nombre', 'precioCompra', 'cantidad', 'subtotal', 'accion'];

  constructor(private router: Router, private dialogo: MatDialog){}

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

  agregarProducto() {
    if (this.productoSeleccionado && this.producto.cantidad > 0 && this.producto.precioCompra > 0) {
      const subtotalCalculado = Number(this.producto.precioCompra) * Number(this.producto.cantidad);
      const productoAgregado = {
        id: this.productoSeleccionado.id,
        nombre: this.productoSeleccionado.nombre,
        precioCompra: this.producto.precioCompra,
        cantidad: this.producto.cantidad,
        subtotal: subtotalCalculado
      };
      
      this.productosAgregados.push(productoAgregado);
      this.dataSource.data = [...this.productosAgregados]; // Actualizar el dataSource
      console.log(productoAgregado);
      // Limpiar campos
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
    // Aquí envías toda la data a tu backend
  }
}
