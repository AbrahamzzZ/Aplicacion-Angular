import { Component, inject } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { TransportistaService } from '../../../services/transportista.service';
import { ITransportista } from '../../models/transportista';


@Component({
  selector: 'app-transportista-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIcon, RouterOutlet],
  templateUrl: './transportista-inicio.component.html',
  styleUrl: './transportista-inicio.component.scss'
})
export class TransportistaInicioComponent {
  private transportistaServicio = inject(TransportistaService);
  public listaTransportista: ITransportista[] = [];
  public displayedColumns: string[] = ['id', 'codigo', 'nombres', 'apellidos', 'cedula', 'telefono', 'correo_Electronico', 'imagen', 'estado', 'fecha_Registro', 'accion'];

  obtenerTransportista(){
    this.transportistaServicio.lista().subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.listaTransportista = data.map(transportista => {
            if (transportista.imagenBase64 && typeof transportista.imagenBase64 === 'string') {
              transportista.imagen = `data:image/png;base64,${transportista.imagenBase64}`;
            } else {
              transportista.imagen = 'assets/default-user.png'; // Imagen por defecto si no hay foto
            }
            return transportista;
          });
        }
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  constructor(private router:Router){
    this.obtenerTransportista();
  }

  getEstado(estado: boolean): string{
    return estado ? 'Activo': 'No Activo';
  }

  getFechaRegistro(fecha: string): string{
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  nuevo(){
    this.router.navigate(['transportista/transportista-registro',0]);
  }

  editar(transportista: ITransportista){
    this.router.navigate(['transportista/transportista-editar',transportista.id]);
  }
}
