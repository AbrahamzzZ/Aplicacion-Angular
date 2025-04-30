import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { IProducto } from '../../models/producto';
import { DialogoConfirmacionComponent } from '../../dialog/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass } from '@angular/common';
import { Metodos } from '../../../utility/metodos';

@Component({
  selector: 'app-producto-inicio',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    RouterOutlet,
    NgClass
  ],
  templateUrl: './producto-inicio.component.html',
  styleUrl: './producto-inicio.component.scss'
})
export class ProductoInicioComponent {
  private productoServicio = inject(ProductoService);
  private snackBar = inject(MatSnackBar);
  public listaProducto = new MatTableDataSource<IProducto>();
  public displayedColumns: string[] = [
    'id',
    'codigo',
    'nombre',
    'descripcion',
    'categoria',
    'pais_Origen',
    'stock',
    'precio_Compra',
    'precio_Venta',
    'estado',
    'accion'
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    this.obtenerProducto();
  }

  obtenerProducto() {
    this.productoServicio.lista().subscribe({
      next: (data) => {
        this.listaProducto.data = data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  eliminar(producto: IProducto) {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      width: '350px',
      data: { mensaje: `¿Está seguro de eliminar este producto ${producto.nombre}?` }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productoServicio.eliminar(producto.id).subscribe({
          next: (data) => {
            if (data.isSuccess) {
              this.obtenerProducto();
              this.mostrarMensaje('Producto eliminado correctamente.', 'success');
            }
          },
          error: (err) => {
            console.log(err.message);
            this.mostrarMensaje('Error al eliminar el Producto.', 'error');
          }
        });
      }
    });
  }

  nuevo() {
    this.router.navigate(['producto/producto-registro', 0]);
  }

  editar(producto: IProducto) {
    this.router.navigate(['producto/producto-editar', producto.id]);
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

  filtrarProductos(termino: string) {
    this.listaProducto.filter = termino.trim().toLowerCase();
  }

  exportarExcel() {
    const datos = this.listaProducto.data.map(producto => ({
      ID: producto.id,
      Código: producto.codigo,
      Nombre: producto.nombre,
      Descripción: producto.descripcion,
      Categoría: producto.oCategoria.nombre,
      'País Origen': producto.pais_Origen,
      Stock: producto.stock,
      'Precio Compra': producto.precio_Compra,
      'Precio Venta': producto.precio_Venta,
      Estado: this.getEstado(producto.estado)
    }));

    if (!datos || datos.length === 0) {
      this.mostrarMensaje("No hay datos disponibles para exportar a Excel.", "error");
      return;
    }
  
    Metodos.exportarExcel('Productos', datos, [
      'ID', 'Código', 'Nombre', 'Descripción', 'Categoría', 
      'País Origen', 'Stock', 'Precio Compra', 'Precio Venta', 'Estado'
    ]);
    this.mostrarMensaje("Excel generado exitosamente.", "success");
  }

  getEstado(estado: boolean): string {
    return estado ? 'Agotado' : 'No Agotado';
  }

  getFechaRegistro(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
