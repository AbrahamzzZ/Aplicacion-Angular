import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterOutlet } from '@angular/router';
import { OfertaService } from '../../../services/oferta.service';
import { IOferta } from '../../models/oferta';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '../../components/dialogo-confirmacion/dialogo-confirmacion.component';
import { Metodos } from '../../../utility/metodos';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-oferta-inicio',
  standalone: true,
  imports: [MatTableModule,
      MatButtonModule,
      MatIcon,
      NgClass,
      MatFormFieldModule,
      MatInputModule,
      RouterOutlet],
  templateUrl: './oferta-inicio.component.html',
  styleUrl: './oferta-inicio.component.scss'
})
export class OfertaInicioComponent {
  private ofertaServicio = inject(OfertaService);
  private snackBar = inject(MatSnackBar);
  public listaOferta = new MatTableDataSource<IOferta>();
  displayedColumns: string[] = [
    'id',
    'codigo',
    'nombre',
    'producto',
    'descripcion',
    'fecha_Inicio',
    'fecha_Fin',
    'descuento',
    'estado',
    'accion'
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    this.obtenerOferta();
  }

  obtenerOferta() {
    this.ofertaServicio.lista().subscribe({
      next: (data) => {
        this.listaOferta.data = data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  eliminar(oferta: IOferta) {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      width: '350px',
      data: {
        mensaje: `¿Está seguro de eliminar la oferta ${oferta.nombre}?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ofertaServicio.eliminar(oferta.id).subscribe({
          next: (data) => {
            if (data.isSuccess) {
              this.obtenerOferta();
              this.mostrarMensaje('✔ Oferta eliminado correctamente.');
            }
          },
          error: (err) => {
            console.log(err.message);
            this.mostrarMensaje('❌ Error al eliminar la oferta.');
          }
        });
      }
    });
  }

  nuevo() {
    this.router.navigate(['oferta/oferta-registro', 0]);
  }

  editar(oferta: IOferta) {
    this.router.navigate(['oferta/oferta-editar', oferta.id]);
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Módulo Oferta', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  filtrarOfertas(termino: string) {
    this.listaOferta.filter = termino.trim().toLowerCase();
  }

  exportarExcel() {
    const datos = this.listaOferta.data.map(oferta => ({
      ID: oferta.id,
      Código: oferta.codigo,
      Nombre: oferta.nombre,
      Producto: oferta.oProducto.nombre,
      Descripcion: oferta.descripcion,
      'Fecha Inicio': oferta.fecha_Inicio,
      'Fecha Fin': oferta.fecha_Fin,
      Descuento: oferta.descuento,
      Estado: oferta.estado,
      'Fecha Creacion': oferta.fecha_Creacion
    }));

    if (!datos || datos.length === 0) {
      this.mostrarMensaje("No hay datos disponibles para exportar a Excel.");
      return;
    }
  
    Metodos.exportarExcel('Productos', datos, [
      'ID', 'Código', 'Nombre', 'Producto', 'Descripcion', 
      'Fecha Inicio', 'Fecha Fin', 'Descuento','Estado','Fecha Creacion'
    ]);
  }

  getEstado(estado: boolean): string {
    return estado ? 'Activo' : 'No Activo';
  }

  getFechaInicioFin(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
