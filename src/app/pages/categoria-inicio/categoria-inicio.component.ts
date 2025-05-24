import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterOutlet } from '@angular/router';
import { CategoriaService } from '../../../services/categoria.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategoria } from '../../models/categoria';
import { MatDialog } from '@angular/material/dialog';
import { Metodos } from '../../../utility/metodos';
import { DialogoConfirmacionComponent } from '../../components/dialog/dialogo-confirmacion/dialogo-confirmacion.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-categoria-inicio',
  standalone: true,
  imports: [ MatTableModule,
      MatButtonModule,
      MatIcon,
      MatFormFieldModule,
      MatInputModule,
      RouterOutlet,
      NgClass],
  templateUrl: './categoria-inicio.component.html',
  styleUrl: './categoria-inicio.component.scss'
})
export class CategoriaInicioComponent {
  private categoriaServicio = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);
  public listaCategoria = new MatTableDataSource<ICategoria>();
displayedColumns: string[] = [
    'id',
    'codigo',
    'nombre',
    'estado',
    'fecha_Creacion',
    'accion'
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    this.obtenerCategoria();
  }

  obtenerCategoria() {
    this.categoriaServicio.lista().subscribe({
      next: (data) => {
        this.listaCategoria.data = data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  eliminar(categoria: ICategoria) {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      width: '350px',
      data: {
        mensaje: `¿Está seguro de eliminar la categoría ${categoria.nombre}?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoriaServicio.eliminar(categoria.id).subscribe({
          next: (data) => {
            if (data.isSuccess) {
              this.obtenerCategoria();
              this.mostrarMensaje('Categoría eliminado correctamente.', 'success');
            }
          },
          error: (err) => {
            console.log(err.message);
            this.mostrarMensaje('Error al eliminar la Categoría.', 'error');
          }
        });
      }
    });
  }

  nuevo() {
    this.router.navigate(['categoria/categoria-registro', 0]);
  }

  editar(categoria: ICategoria) {
    this.router.navigate(['categoria/categoria-editar', categoria.id]);
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

  filtrarCategorias(termino: string) {
    this.listaCategoria.filter = termino.trim().toLowerCase();
  }

  exportarExcel() {
    const datos = this.listaCategoria.data.map(categoria => ({
      ID: categoria.id,
      Código: categoria.codigo,
      Nombre: categoria.nombre,
      Estado: this.getEstado(categoria.estado),
      'Fecha Creacion': this.getFechaRegistro(categoria.fecha_Creacion)
    }));

    if (!datos || datos.length === 0) {
      this.mostrarMensaje("No hay datos disponibles para exportar a Excel.", "error");
      return;
    }
  
    Metodos.exportarExcel('Productos', datos, [
      'ID', 'Código', 'Nombre', 'Estado', 'Fecha Creacion'
    ]);
    this.mostrarMensaje("Excel generado exitosamente.", "success");
  }

  getEstado(estado: boolean): string {
    return estado ? 'Activo' : 'No Activo';
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
