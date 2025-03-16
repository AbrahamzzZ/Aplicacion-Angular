import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-usuario-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIcon],
  templateUrl: './usuario-inicio.component.html',
  styleUrl: './usuario-inicio.component.scss'
})
export class UsuarioInicioComponent {
  displayedColumns: string[] = ['id', 'codigo', 'nombre_completo', 'correo_electronico', 'clave', 'estado', 'fecha_creacion', 'accion'];
}
