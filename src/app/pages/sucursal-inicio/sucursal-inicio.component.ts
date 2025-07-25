import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { SucursalService } from '../../../services/sucursal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ISucursal } from '../../interfaces/sucursal';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '../../components/dialog/dialogo-confirmacion/dialogo-confirmacion.component';
import { Metodos } from '../../../utility/metodos';

@Component({
  selector: 'app-sucursal-inicio',
  standalone: true,
  imports: [    
    MatTableModule,
    MatButtonModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    RouterOutlet,
    NgClass,
    MatPaginatorModule],
  templateUrl: './sucursal-inicio.component.html',
  styleUrl: './sucursal-inicio.component.scss'
})
export class SucursalInicioComponent implements AfterViewInit{
  private sucursalServicio = inject(SucursalService);
  private snackBar = inject(MatSnackBar);
  public listaSucursal = new MatTableDataSource<ISucursal>();
  public displayedColumns: string[] = [
    'id',
    'codigo',
    'nombre',
    'direccion',
    'latitud',
    'longitud',
    'ciudad',
    'estado',
    'accion'
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    this.obtenerSucursal();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.listaSucursal.paginator = this.paginator;
  }

  obtenerSucursal() {
    this.sucursalServicio.lista().subscribe({
      next: (data) => {
        this.listaSucursal.data = data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  eliminar(sucursal: ISucursal) {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      width: '350px',
      data: {
        mensaje: `¿Está seguro de eliminar la sucursal ${sucursal.nombre}?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sucursalServicio.eliminar(sucursal.id).subscribe({
          next: (data) => {
            if (data.isSuccess) {
              this.obtenerSucursal();
              this.mostrarMensaje('Sucursal eliminada correctamente.', 'success');
            }
          },
          error: (err) => {
            console.log(err.message);
            this.mostrarMensaje('Error al eliminar la Sucursal.', 'error');
          }
        });
      }
    });
  }

  nuevo() {
    this.router.navigate(['sucursal/sucursal-registro', 0]);
  }

  editar(sucursal: ISucursal) {
    this.router.navigate(['sucursal/sucursal-editar', sucursal.id]);
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

  filtrarSucursales(termino: string) {
    this.listaSucursal.filter = termino.trim().toLowerCase();
    if (this.listaSucursal.paginator) {
      this.listaSucursal.paginator.firstPage();
    }
  }

  exportarExcel() {
    const datos = this.listaSucursal.data.map(sucursal => ({
      ID: sucursal.id,
      Código: sucursal.codigo,
      Nombres: sucursal.nombre,
      Direccion: sucursal.direccion,
      Latitud: sucursal.latitud,
      Longitud: sucursal.longitud,
      Ciudad: sucursal.ciudad,
      Estado: this.getEstado(sucursal.estado)
    }));

    if (!datos || datos.length === 0) {
      this.mostrarMensaje("No hay datos disponibles para exportar a Excel.", "error");
      return;
    }
  
    Metodos.exportarExcel('Productos', datos, [
      'ID', 'Código', 'Nombre', 'Direccion', 'Latitud', 
      'Longitud', 'Ciudad', 'Estado'
    ]);
    this.mostrarMensaje("Excel generado exitosamente.", "success");
  }

  getEstado(estado: boolean): string {
    return estado ? 'Activo' : 'No Activo';
  }
}
