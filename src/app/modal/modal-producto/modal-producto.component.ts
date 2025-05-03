import { Component } from '@angular/core';
import { IProducto } from '../../models/producto';
import { ProductoService } from '../../../services/producto.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [MatTableModule, MatIcon],
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.scss'
})
export class ModalProductoComponent {
  listaProductos: IProducto[] = [];
  columnas: string[] = ['id', 'codigo','nombre', 'stock', 'estado', 'accion'];

  constructor(
    private dialogRef: MatDialogRef<ModalProductoComponent>,
    private productoService: ProductoService
  ) {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productoService.lista().subscribe({
      next: (data) => this.listaProductos = data,
      error: (e) => console.error(e)
    });
  }

  seleccionarProducto(producto: IProducto) {
    this.dialogRef.close(producto);
  }

  cerrar() {
    this.dialogRef.close();
  }
}
