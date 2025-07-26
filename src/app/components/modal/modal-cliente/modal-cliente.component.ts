import { Component } from '@angular/core';
import { ICliente } from '../../../interfaces/cliente';
import { ClienteService } from '../../../../services/cliente.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-modal-cliente',
  standalone: true,
  imports: [MatTableModule, MatIcon],
  templateUrl: './modal-cliente.component.html',
  styleUrl: './modal-cliente.component.scss'
})
export class ModalClienteComponent {
  listaClientes: ICliente[] = [];
  columnas: string[] = ['id', 'nombres', 'apellidos', 'cedula', 'accion'];

  constructor(
    private dialogRef: MatDialogRef<ModalClienteComponent>,
    private clienteService: ClienteService
  ) {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.clienteService.lista().subscribe({
      next: (data) => this.listaClientes = data,
      error: (e) => console.error(e)
    });
  }

  seleccionarCliente(cliente: ICliente) {
    this.dialogRef.close(cliente);
  }

  cerrar() {
    this.dialogRef.close();
  }
}
