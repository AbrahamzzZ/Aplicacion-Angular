import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterOutlet } from '@angular/router';
import { CategoriaService } from '../../../services/categoria.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategoria } from '../../interfaces/categoria';
import { MatDialog } from '@angular/material/dialog';
import { Metodos } from '../../../utility/metodos';
import { DialogoConfirmacionComponent } from '../../components/dialog/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
      NgClass,
    MatPaginatorModule],
  templateUrl: './categoria-inicio.component.html',
  styleUrl: './categoria-inicio.component.scss'
})
export class CategoriaInicioComponent implements AfterViewInit{
  private categoriaServicio = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);
  public listaCategoria = new MatTableDataSource<ICategoria>();
  public tituloExcel = 'Categorías';
displayedColumns: string[] = [
    'idCategoria',
    'codigo',
    'nombreCategoria',
    'estado',
    'fechaCreacion',
    'accion'
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    this.obtenerCategoria();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.listaCategoria.paginator = this.paginator;
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
        mensaje: `¿Está seguro de eliminar la categoría ${categoria.nombre_Categoria}?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoriaServicio.eliminar(categoria.id_Categoria).subscribe({
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
    this.router.navigate(['categoria/categoria-editar', categoria.id_Categoria]);
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
    if (this.listaCategoria.paginator) {
      this.listaCategoria.paginator.firstPage();
    }
  }

  exportarExcel() {
    const datos = this.listaCategoria.data.map(categoria => ({
      ID: categoria.id_Categoria,
      Código: categoria.codigo,
      Nombre: categoria.nombre_Categoria,
      Estado: this.getEstado(categoria.estado),
      'Fecha Creacion': this.getFechaRegistro(categoria.fecha_Creacion ?? '')
    }));

    if (!datos || datos.length === 0) {
      this.mostrarMensaje("No hay datos disponibles para exportar a Excel.", "error");
      return;
    }
  
    Metodos.exportarExcel(this.tituloExcel, datos, [
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
