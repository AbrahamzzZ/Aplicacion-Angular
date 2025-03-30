import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { IUsuario } from '../../models/usuario';
import { DialogoConfirmacionComponent } from '../../components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass } from '@angular/common';

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
    NgClass
  ],
  templateUrl: './usuario-inicio.component.html',
  styleUrl: './usuario-inicio.component.scss'
})
export class UsuarioInicioComponent {
  private usuarioServicio = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);
  public listaUsuario = new MatTableDataSource<IUsuario>();
  public displayedColumns: string[] = [
    'id',
    'codigo',
    'nombre_Completo',
    'correo_Electronico',
    'clave',
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
              this.mostrarMensaje('✔ Usuario eliminado correctamente.');
            }
          },
          error: (err) => {
            console.log(err.message);
            this.mostrarMensaje('❌ Error al eliminar al usuario.');
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

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, ':)', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  filtrarUsuarios(termino: string) {
    this.listaUsuario.filter = termino.trim().toLowerCase();
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
