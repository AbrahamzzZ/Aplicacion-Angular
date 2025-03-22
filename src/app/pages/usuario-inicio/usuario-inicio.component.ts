import { Component, inject } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { IUsuario } from '../../models/usuario';

@Component({
  selector: 'app-usuario-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIcon, RouterOutlet],
  templateUrl: './usuario-inicio.component.html',
  styleUrl: './usuario-inicio.component.scss'
})
export class UsuarioInicioComponent {
  private usuarioServicio = inject(UsuarioService);
  public listaUsuario: IUsuario[]=[];
  public displayedColumns: string[] = ['id', 'codigo', 'nombre_Completo', 'correo_Electronico', 'clave', 'estado', 'fecha_Creacion', 'accion'];

  obtenerUsuario(){
    this.usuarioServicio.lista().subscribe({
      next:(data)=>{
        if(data.length > 0){
          console.log('Usuario obtenido: ', data);
          this.listaUsuario = data;
        }
      },
      error:(err)=>{
        console.log(err.message);
      }
    })
  }

  constructor(private router:Router){
    this.obtenerUsuario();
  }

  getEstado(estado: boolean): string{
    return estado ? 'Activo': 'No Activo';
  }

  getFechaCreacion(fecha: string): string{
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  nuevo(){
    this.router.navigate(['usuario/usuario-registro',0]);
  }

  editar(usuario: IUsuario){
    this.router.navigate(['usuario/usuario-editar',usuario.id]);
  }
}
