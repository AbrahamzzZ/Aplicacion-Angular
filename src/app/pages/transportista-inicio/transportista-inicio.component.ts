import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { TransportistaService } from '../../../services/transportista.service';
import { ITransportista } from '../../models/transportista';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '../../components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-transportista-inicio',
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
  templateUrl: './transportista-inicio.component.html',
  styleUrl: './transportista-inicio.component.scss'
})
export class TransportistaInicioComponent {
  private transportistaServicio = inject(TransportistaService);
  private snackBar = inject(MatSnackBar);
  public listaTransportista = new MatTableDataSource<ITransportista>();
  public displayedColumns: string[] = [
    'id',
    'codigo',
    'nombres',
    'apellidos',
    'cedula',
    'telefono',
    'correo_Electronico',
    'imagen',
    'estado',
    'fecha_Registro',
    'accion'
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    this.obtenerTransportista();
  }

  obtenerTransportista() {
    this.transportistaServicio.lista().subscribe({
      next: (data) => {
        this.listaTransportista.data = data.map((transportista) => {
          if (transportista.imagenBase64 && typeof transportista.imagenBase64 === 'string') {
            transportista.imagen = `data:image/png;base64,${transportista.imagenBase64}`;
          } else {
            transportista.imagen = 'assets/default-user.png'; // Imagen por defecto si no hay foto
          }
          return transportista;
        });
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  eliminar(transportista: ITransportista) {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      width: '350px',
      data: {
        mensaje: `¿Está seguro de eliminar al transportista ${transportista.nombres} ${transportista.apellidos}?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.transportistaServicio.eliminar(transportista.id).subscribe({
          next: (data) => {
            if (data.isSuccess) {
              this.obtenerTransportista();
              this.mostrarMensaje('✔ Transportista eliminado correctamente.');
            }
          },
          error: (err) => {
            console.log(err.message);
            this.mostrarMensaje('❌ Error al eliminar al transportista.');
          }
        });
      }
    });
  }

  nuevo() {
    this.router.navigate(['transportista/transportista-registro', 0]);
  }

  editar(transportista: ITransportista) {
    this.router.navigate(['transportista/transportista-editar', transportista.id]);
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Módulo Transportista', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  filtrarTransportistas(termino: string) {
    this.listaTransportista.filter = termino.trim().toLowerCase();
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
