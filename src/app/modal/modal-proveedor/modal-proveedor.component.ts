import { Component } from '@angular/core';
import { IProveedor } from '../../models/proveedor';
import { MatDialogRef} from '@angular/material/dialog';
import { ProveedorService } from '../../../services/proveedor.service';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-modal-proveedor',
  standalone: true,
  imports: [MatTableModule, MatIcon, NgClass],
  templateUrl: './modal-proveedor.component.html',
  styleUrl: './modal-proveedor.component.scss'
})
export class ModalProveedorComponent {
  listaProveedores: IProveedor[] = [];
  columnas: string[] = ['id', 'nombres', 'apellidos', 'cedula', 'estado', 'accion'];

  constructor(
    private dialogRef: MatDialogRef<ModalProveedorComponent>,
    private proveedorService: ProveedorService
  ) {
    this.obtenerProveedores();
  }

  obtenerProveedores() {
    this.proveedorService.lista().subscribe({
      next: (data) => this.listaProveedores = data,
      error: (e) => console.error(e)
    });
  }

  seleccionarProveedor(proveedor: IProveedor) {
    this.dialogRef.close(proveedor);
  }

  cerrar() {
    this.dialogRef.close();
  }

  getEstado(estado: boolean): string {
    return estado ? 'Activo' : 'No Activo';
  }
}
