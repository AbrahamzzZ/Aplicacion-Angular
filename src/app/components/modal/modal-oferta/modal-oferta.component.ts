import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { IOferta } from '../../../interfaces/oferta';
import { OfertaService } from '../../../../services/oferta.service';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-modal-oferta',
  standalone: true,
  imports: [MatTableModule, MatIcon, NgClass],
  templateUrl: './modal-oferta.component.html',
  styleUrl: './modal-oferta.component.scss'
})
export class ModalOfertaComponent {
  listaOfertas: IOferta[] = [];
  columnas: string[] = ['id', 'codigo', 'nombre', 'producto', 'estado', 'accion'];

  constructor(
    private dialogRef: MatDialogRef<ModalOfertaComponent>,
    private ofertaService: OfertaService
  ) {
    this.obtenerOfertas();
  }

  obtenerOfertas() {
    this.ofertaService.lista().subscribe({
      next: (data) => this.listaOfertas = data,
      error: (e) => console.error(e)
    });
  }

  seleccionarOferta(oferta: IOferta) {
    this.dialogRef.close(oferta);
  }

  cerrar() {
    this.dialogRef.close();
  }
  
  getEstado(estado: boolean): string {
    return estado ? 'Activo' : 'No Activo';
  }
}
