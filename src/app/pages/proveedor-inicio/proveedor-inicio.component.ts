import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-proveedor-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIcon, RouterLink, RouterOutlet],
  templateUrl: './proveedor-inicio.component.html',
  styleUrl: './proveedor-inicio.component.scss'
})
export class RegistroProveedorInicioComponent {
  displayedColumns: string[] = ['id', 'codigo', 'nombres', 'apellidos', 'cedula', 'telefono', 'correo_electronico', 'estado', 'fecha_registro', 'accion'];
}
