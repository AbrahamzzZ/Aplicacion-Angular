import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { IUsuario } from '../../interfaces/usuario';
import { DialogoConfirmacionComponent } from '../../components/dialog/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgClass } from '@angular/common';
import { Metodos } from '../../../utility/metodos';

@Component({
  selector: 'app-usuario-inicio',
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
  templateUrl: './usuario-inicio.component.html',
  styleUrl: './usuario-inicio.component.scss'
})
export class UsuarioInicioComponent implements AfterViewInit{
  private usuarioServicio = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);
  public listaUsuario = new MatTableDataSource<IUsuario>();
  public displayedColumns: string[] = [
    'id',
    'codigo',
    'nombre_Completo',
    'correo_Electronico',
    'rol',
    'estado',
    'fecha_Creacion',
    'accion'
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    this.obtenerUsuario();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.listaUsuario.paginator = this.paginator;
  }

  obtenerUsuario() {
    this.usuarioServicio.lista().subscribe({
      next: (data) => {
        this.listaUsuario.data = data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  eliminar(usuario: IUsuario) {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      width: '350px',
      data: { mensaje: `¿Está seguro de eliminar al usuario ${usuario.nombre_Completo}?` }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.usuarioServicio.eliminar(usuario.id).subscribe({
          next: (data) => {
            if (data.isSuccess) {
              this.obtenerUsuario();
              this.mostrarMensaje('Usuario eliminado correctamente.', 'success');
            }
          },
          error: (err) => {
            console.log(err.message);
            this.mostrarMensaje('Error al eliminar al usuario.', 'error');
          }
        });
      }
    });
  }

  nuevo() {
    this.router.navigate(['usuario/usuario-registro', 0]);
  }

  editar(usuario: IUsuario) {
    this.router.navigate(['usuario/usuario-editar', usuario.id]);
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

  filtrarUsuarios(termino: string) {
    this.listaUsuario.filter = termino.trim().toLowerCase();
    if (this.listaUsuario.paginator) {
      this.listaUsuario.paginator.firstPage();
    }
  }

  exportarExcel() {
    const datos = this.listaUsuario.data.map(usuario => ({
      ID: usuario.id,
      Código: usuario.codigo,
      'Nombre Completo': usuario.nombre_Completo,
      'Correo Electronico': usuario.correo_Electronico,
      Rol: usuario.oRol.nombre,
      Estado: this.getEstado(usuario.estado),
      'Fecha Creacion': this.getFechaCreacion(usuario.fecha_Creacion)
    }));

    if (!datos || datos.length === 0) {
      this.mostrarMensaje("No hay datos disponibles para exportar a Excel.", "error");
      return;
    }
  
    Metodos.exportarExcel('Productos', datos, [
      'ID', 'Código', 'Nombre Completo', 'Correo Electronico', 'Rol', 'Estado', 'Fecha Creacion'
    ]);
    this.mostrarMensaje("Excel generado exitosamente.", "success");
  }

  getEstado(estado: boolean): string {
    return estado ? 'Activo' : 'No Activo';
  }

  getFechaCreacion(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
