import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-usuario-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIcon, RouterLink, RouterOutlet],
  templateUrl: './usuario-inicio.component.html',
  styleUrl: './usuario-inicio.component.scss'
})
export class UsuarioInicioComponent {
  displayedColumns: string[] = ['id', 'codigo', 'nombre_completo', 'correo_electronico', 'clave', 'estado', 'fecha_creacion', 'accion'];
}
