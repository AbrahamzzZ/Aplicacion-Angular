import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { TransportistaService } from '../../../services/transportista.service';
import { ITransportista } from '../../interfaces/transportista';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '../../components/dialog/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgClass } from '@angular/common';
import { Metodos } from '../../../utility/metodos';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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
    NgClass,
    MatPaginatorModule
  ],
  templateUrl: './transportista-inicio.component.html',
  styleUrl: './transportista-inicio.component.scss'
})
export class TransportistaInicioComponent implements AfterViewInit{
  private transportistaServicio = inject(TransportistaService);
  private snackBar = inject(MatSnackBar);
  public listaTransportista = new MatTableDataSource<ITransportista>();
  public tituloExcel = 'Transportistas';
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.listaTransportista.paginator = this.paginator;
  }

  obtenerTransportista() {
    this.transportistaServicio.lista().subscribe({
      next: (data) => {
        this.listaTransportista.data = data.map((transportista) => {
          if (transportista.imagen && typeof transportista.imagen === 'string') {
            transportista.imagen = `data:image/*;base64,${transportista.imagen}`;
          } else {
            transportista.imagen = 'assets/images/default-avatar.jpg'; // Imagen por defecto si no hay foto
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
        this.transportistaServicio.eliminar(transportista.id_Transportista).subscribe({
          next: (data) => {
            if (data.isSuccess) {
              this.obtenerTransportista();
              this.mostrarMensaje('Transportista eliminado correctamente.', 'success');
            }
          },
          error: (err) => {
            console.log(err.message);
            this.mostrarMensaje('Error al eliminar al transportista.', 'error');
          }
        });
      }
    });
  }

  nuevo() {
    this.router.navigate(['transportista/transportista-registro', 0]);
  }

  editar(transportista: ITransportista) {
    this.router.navigate(['transportista/transportista-editar', transportista.id_Transportista]);
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

  filtrarTransportistas(termino: string) {
    this.listaTransportista.filter = termino.trim().toLowerCase();
    if (this.listaTransportista.paginator) {
      this.listaTransportista.paginator.firstPage();
    }
  }

  exportarExcel() {
    const datos = this.listaTransportista.data.map(transportista => ({
      ID: transportista.id_Transportista,
      Código: transportista.codigo,
      Nombres: transportista.nombres,
      Apellidos: transportista.apellidos,
      Cedula: transportista.cedula,
      Telefono: transportista.telefono,
      'Correo Electronico': transportista.correo_Electronico,
      Estado: this.getEstado(transportista.estado),
      'Fecha Registro': this.getFechaRegistro(transportista.fecha_Registro ?? '')
    }));

    if (!datos || datos.length === 0) {
      this.mostrarMensaje("No hay datos disponibles para exportar a Excel.", "error");
      return;
    }
  
    Metodos.exportarExcel(this.tituloExcel, datos, [
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
