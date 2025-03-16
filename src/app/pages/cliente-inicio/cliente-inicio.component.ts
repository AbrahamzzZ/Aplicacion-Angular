import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cliente-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule,MatIcon],
  templateUrl: './cliente-inicio.component.html',
  styleUrl: './cliente-inicio.component.scss'
})
export class ClienteInicioComponent {
  displayedColumns: string[] = ['id', 'codigo', 'nombres', 'apellidos', 'cedula', 'telefono', 'correo_electronico', 'fecha_registro', 'accion'];
}
