import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { ICliente } from '../../models/cliente';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '../../components/dialog/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Metodos } from '../../../utility/metodos';

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
              this.mostrarMensaje('Cliente eliminado correctamente.', 'success');
            }
          },
          error: (err) => {
            console.log(err.message);
            this.mostrarMensaje('Error al eliminar al Cliente.', 'error');
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

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' = 'success') {
    const className = tipo === 'success' ? 'success-snackbar' : 'error-snackbar';
    
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: [className]
    });
  }

  filtrarClientes(termino: string) {
    this.listaCliente.filter = termino.trim().toLowerCase();
  }

  exportarExcel() {
    const datos = this.listaCliente.data.map(cliente => ({
      ID: cliente.id,
      Código: cliente.codigo,
      Nombres: cliente.nombres,
      Apellidos: cliente.apellidos,
      Cedula: cliente.cedula,
      Telefono: cliente.telefono,
      'Correo Electronico': cliente.correo_Electronico,
      'Fecha Registro': this.getFechaRegistro(cliente.fecha_Registro)
    }));

    if (!datos || datos.length === 0) {
      this.mostrarMensaje("No hay datos disponibles para exportar a Excel.", "error");
      return;
    }
  
    Metodos.exportarExcel('Productos', datos, [
      'ID', 'Código', 'Nombres', 'Apellidos', 'Cedula', 
      'Telefono', 'Correo Electronico', 'Fecha Registro'
    ]);
    this.mostrarMensaje("Excel generado exitosamente.", "success");
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
