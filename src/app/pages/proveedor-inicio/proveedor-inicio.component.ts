import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { ProveedorService } from '../../../services/proveedor.service';
import { IProveedor } from '../../interfaces/proveedor';
import { DialogoConfirmacionComponent } from '../../components/dialog/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgClass } from '@angular/common';
import { Metodos } from '../../../utility/metodos';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-proveedor-inicio',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    RouterOutlet,
    NgClass,
    MatPaginatorModule
  ],
  templateUrl: './proveedor-inicio.component.html',
  styleUrl: './proveedor-inicio.component.scss'
})
export class ProveedorInicioComponent implements AfterViewInit{
  private proveedorServicio = inject(ProveedorService);
  private snackBar = inject(MatSnackBar);
  public listaProveedor = new MatTableDataSource<IProveedor>();
  public displayedColumns: string[] = [
    'id',
    'codigo',
    'nombres',
    'apellidos',
    'cedula',
    'telefono',
    'correo_Electronico',
    'estado',
    'fecha_Registro',
    'accion'
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    this.obtenerProveedor();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.listaProveedor.paginator = this.paginator;
  }

  obtenerProveedor() {
    this.proveedorServicio.lista().subscribe({
      next: (data) => {
        this.listaProveedor.data = data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  eliminar(proveedor: IProveedor) {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      width: '350px',
      data: {
        mensaje: `¿Está seguro de eliminar al proveedor ${proveedor.nombres} ${proveedor.apellidos}?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.proveedorServicio.eliminar(proveedor.id).subscribe({
          next: (data) => {
            if (data.isSuccess) {
              this.obtenerProveedor();
              this.mostrarMensaje('Proveedor eliminado correctamente.', 'success');
            }
          },
          error: (err) => {
            console.log(err.message);
            this.mostrarMensaje('Error al eliminar el Proveedor.', 'error');
          }
        });
      }
    });
  }

  nuevo() {
    this.router.navigate(['proveedor/proveedor-registro', 0]);
  }

  editar(proveedor: IProveedor) {
    this.router.navigate(['proveedor/proveedor-editar', proveedor.id]);
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

  filtrarProveedores(termino: string) {
    this.listaProveedor.filter = termino.trim().toLowerCase();
    if (this.listaProveedor.paginator) {
      this.listaProveedor.paginator.firstPage();
    }
  }

  exportarExcel() {
    const datos = this.listaProveedor.data.map(proveedor => ({
      ID: proveedor.id,
      Código: proveedor.codigo,
      Nombres: proveedor.nombres,
      Apellidos: proveedor.apellidos,
      Cedula: proveedor.cedula,
      Telefono: proveedor.telefono,
      'Correo Electronico': proveedor.correo_Electronico,
      Estado: this.getEstado(proveedor.estado),
      'Fecha Registro': this.getFechaRegistro(proveedor.fecha_Registro)
    }));

    if (!datos || datos.length === 0) {
      this.mostrarMensaje("No hay datos disponibles para exportar a Excel.", "error");
      return;
    }
  
    Metodos.exportarExcel('Productos', datos, [
      'ID', 'Código', 'Nombres', 'Apellidos', 'Cedula', 
      'Telefono', 'Correo Electronico', 'Estado', 'Fecha Registro'
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
