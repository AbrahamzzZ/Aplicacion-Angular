import { Component } from '@angular/core';
import { IProducto } from '../../../interfaces/producto';
import { ProductoService } from '../../../../services/producto.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { IProductoCategoria } from '../../../interfaces/Dto/iproducto-categoria';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [
    MatTableModule,
    MatIcon,
    NgClass,
    MatLabel,
    MatFormFieldModule,
    NgIf,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.scss'
})
export class ModalProductoComponent {
  dataSource = new MatTableDataSource<IProducto>([]);
  columnas: string[] = ['id', 'codigo', 'nombre', 'stock', 'estado', 'accion'];
  filtro: string = '';

  constructor(
    private dialogRef: MatDialogRef<ModalProductoComponent>,
    private productoService: ProductoService
  ) {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productoService.lista().subscribe({
      next: (resp: any) => {
        this.dataSource.data = resp.data;

        this.dataSource.filterPredicate = (data: IProducto, filter: string) => {
          const termino = filter.trim().toLowerCase();
          return (
            data.nombre_Producto.toLowerCase().includes(termino) ||
            data.codigo.toLowerCase().includes(termino)
          );
        };
      },
      error: (e) => console.error(e)
    });
  }

  aplicarFiltro(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filtro = value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  limpiarFiltro(input: HTMLInputElement) {
    input.value = '';
    this.filtro = '';
    this.dataSource.filter = '';
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
