import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { ICliente } from '../../models/cliente';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '../../components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cliente-inicio',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    RouterOutlet
  ],
  templateUrl: './cliente-inicio.component.html',
  styleUrl: './cliente-inicio.component.scss'
})
export class ClienteInicioComponent {
  private clienteServicio = inject(ClienteService);
  private snackBar = inject(MatSnackBar);
  public listaCliente = new MatTableDataSource<ICliente>();
  displayedColumns: string[] = [
    'id',
    'codigo',
    'nombres',
    'apellidos',
    'cedula',
    'telefono',
    'correo_Electronico',
    'fecha_Registro',
    'accion'
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    this.obtenerCliente();
  }

  obtenerCliente() {
    this.clienteServicio.lista().subscribe({
      next: (data) => {
        this.listaCliente.data = data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  eliminar(cliente: ICliente) {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      width: '350px',
      data: {
        mensaje: `¿Está seguro de eliminar al cliente ${cliente.nombres} ${cliente.apellidos}?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.clienteServicio.eliminar(cliente.id).subscribe({
          next: (data) => {
            if (data.isSuccess) {
              this.obtenerCliente();
              this.mostrarMensaje('✔ Cliente eliminado correctamente.');
            }
          },
          error: (err) => {
            console.log(err.message);
            this.mostrarMensaje('❌ Error al eliminar al cliente.');
          }
        });
      }
    });
  }

  nuevo() {
    this.router.navigate(['cliente/cliente-registro', 0]);
  }

  editar(cliente: ICliente) {
    this.router.navigate(['cliente/cliente-editar', cliente.id]);
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Módulo Cliente', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  filtrarClientes(termino: string) {
    this.listaCliente.filter = termino.trim().toLowerCase();
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
