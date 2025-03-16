import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-transportista-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIcon],
  templateUrl: './transportista-inicio.component.html',
  styleUrl: './transportista-inicio.component.scss'
})
export class TransportistaInicioComponent {
  displayedColumns: string[] = ['id', 'codigo', 'nombres', 'apellidos', 'cedula', 'telefono', 'correo_electronico', 'imagen', 'estado', 'fecha_registro', 'accion'];
}
