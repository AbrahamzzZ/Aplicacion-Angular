import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-producto-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIcon],
  templateUrl: './producto-inicio.component.html',
  styleUrl: './producto-inicio.component.scss'
})
export class ProductoInicioComponent {
  displayedColumns: string[] = ['id', 'codigo', 'descripcion', 'nombre', 'categoria', 'pais_origen', 'stock', 'precio_venta', 'estado', 'accion'];
}
