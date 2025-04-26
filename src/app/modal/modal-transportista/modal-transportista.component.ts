import { Component } from '@angular/core';
import { ITransportista } from '../../models/transportista';
import { MatDialogRef } from '@angular/material/dialog';
import { TransportistaService } from '../../../services/transportista.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-modal-transportista',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './modal-transportista.component.html',
  styleUrl: './modal-transportista.component.scss'
})
export class ModalTransportistaComponent {
  listaTransportistas: ITransportista[] = [];
  columnas: string[] = ['id', 'nombres', 'apellidos', 'cedula', 'estado', 'accion'];

  constructor(
    private dialogRef: MatDialogRef<ModalTransportistaComponent>,
    private transportistaService: TransportistaService
  ) {
    this.obtenerTransportistas();
  }

  obtenerTransportistas() {
    this.transportistaService.lista().subscribe({
      next: (data) => this.listaTransportistas = data,
      error: (e) => console.error(e)
    });
  }

  seleccionarTransportista(transportista: ITransportista) {
    this.dialogRef.close(transportista);
  }

  cerrar() {
    this.dialogRef.close();
  }
}
