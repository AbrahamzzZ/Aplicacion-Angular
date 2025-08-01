import { Component } from '@angular/core';
import { IProducto } from '../../../interfaces/producto';
import { ProductoService } from '../../../../services/producto.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [MatTableModule, MatIcon, NgClass/*, MatFormFieldModule, MatLabel, MatInputModule*/],
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.scss'
})
export class ModalProductoComponent {
  listaProductos: IProducto[] = [];
  //public listaProducto = new MatTableDataSource<IProducto>();
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

  getEstado(estado: boolean): string {
    return estado ? 'Agotado' : 'No Agotado';
  }

  /*filtrarProductos(termino: string) {
    this.listaProducto.filter = termino.trim().toLowerCase();
    if (this.listaProducto.paginator) {
      this.listaProducto.paginator.firstPage();
    }
  }*/
}
