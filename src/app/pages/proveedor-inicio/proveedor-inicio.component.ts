import { Component, inject } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { ProveedorService } from '../../../services/proveedor.service';
import { IProveedor } from '../../models/proveedor';

@Component({
  selector: 'app-proveedor-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIcon, RouterOutlet],
  templateUrl: './proveedor-inicio.component.html',
  styleUrl: './proveedor-inicio.component.scss'
})
export class RegistroProveedorInicioComponent {
  private proveedorServicio = inject(ProveedorService)
  public listaProveedor: IProveedor[]= [];
  public displayedColumns: string[] = ['id', 'codigo', 'nombres', 'apellidos', 'cedula', 'telefono', 'correo_Electronico', 'estado', 'fecha_Registro', 'accion'];

  obtenerProveedor(){
      this.proveedorServicio.lista().subscribe({
        next:(data)=>{
          if(data.length > 0){
            console.log('Usuario obtenido: ', data);
            this.listaProveedor = data;
          }
        },
        error:(err)=>{
          console.log(err.message);
        }
      })
    }
  
    constructor(private router:Router){
      this.obtenerProveedor();
    }
  
    getEstado(estado: boolean): string{
      return estado ? 'Activo': 'No Activo';
    }
  
    getFechaRegistro(fecha: string): string{
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    nuevo(){
      this.router.navigate(['proveedor/proveedor-registro', 0]);
    }

    editar(proveedor: IProveedor){
      this.router.navigate(['proveedor/proveedor-editar',proveedor.id]);
    }
}
