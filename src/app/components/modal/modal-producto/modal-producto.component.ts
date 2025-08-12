import { Component } from '@angular/core';
import { IProducto } from '../../../interfaces/producto';
import { ProductoService } from '../../../../services/producto.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { IProductoCategoria } from '../../../interfaces/Dto/iproducto-categoria';

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [MatTableModule, MatIcon, NgClass],
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.scss'
})
export class ModalProductoComponent {
  listaProductos: IProductoCategoria[] = [];
  columnas: string[] = ['id', 'codigo','nombre', 'stock', 'estado', 'accion'];

  constructor(
    private dialogRef: MatDialogRef<ModalProductoComponent>,
    private productoService: ProductoService
  ) {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productoService.lista().subscribe({
      next: (resp: any) => this.listaProductos = resp.data,
      error: (e) => console.error(e)
    });
  }

  seleccionarProducto(producto: IProducto) {
    this.dialogRef.close(producto);
  }

  cerrar() {
    this.dialogRef.close();
  }

  getEstado(estado: boolean): string {
    return estado ? 'Agotado' : 'No Agotado';
  }
}
