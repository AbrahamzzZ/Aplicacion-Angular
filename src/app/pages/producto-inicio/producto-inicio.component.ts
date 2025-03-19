import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-producto-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIcon, RouterLink, RouterOutlet],
  templateUrl: './producto-inicio.component.html',
  styleUrl: './producto-inicio.component.scss'
})
export class RegistroProductoInicioComponent {
  displayedColumns: string[] = ['id', 'codigo', 'descripcion', 'nombre', 'categoria', 'pais_origen', 'stock', 'precio_venta', 'estado', 'accion'];
}
