import { Component, inject } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { IProducto } from '../../models/producto';

@Component({
  selector: 'app-producto-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIcon, RouterOutlet],
  templateUrl: './producto-inicio.component.html',
  styleUrl: './producto-inicio.component.scss'
})
export class RegistroProductoInicioComponent {
  private productoServicio = inject(ProductoService);
  public listaProducto: IProducto[]=[];
  public displayedColumns: string[] = ['id', 'codigo', 'descripcion', 'nombre', 'categoria', 'pais_Origen', 'stock', 'precio_Venta', 'estado', 'accion'];
obtenerProducto(){
    this.productoServicio.lista().subscribe({
      next:(data)=>{
        if(data.length > 0){
          console.log('Usuario obtenido: ', data);
          this.listaProducto = data;
        }
      },
      error:(err)=>{
        console.log(err.message);
      }
    })
  }

  constructor(private router:Router){
    this.obtenerProducto();
  }

  getEstado(estado: boolean): string{
    return estado ? 'Activo': 'No Activo';
  }

  getFechaRegistro(fecha: string): string{
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  nuevo(){
    this.router.navigate(['producto/producto-registro',0]);
  }

  editar(producto: IProducto){
    this.router.navigate(['producto/producto-editar',producto.id]);
  }
}
