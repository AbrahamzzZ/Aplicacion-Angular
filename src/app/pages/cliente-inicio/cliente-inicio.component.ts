import { Component, inject } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { ICliente } from '../../models/cliente';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '../../components/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
  selector: 'app-cliente-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule,MatIcon, RouterOutlet],
  templateUrl: './cliente-inicio.component.html',
  styleUrl: './cliente-inicio.component.scss'
})
export class ClienteInicioComponent {
  private clienteService = inject(ClienteService);
  public listaCliente: ICliente[]=[];
  displayedColumns: string[] = ['id', 'codigo', 'nombres', 'apellidos', 'cedula', 'telefono', 'correo_Electronico', 'fecha_Registro', 'accion'];

  constructor(private router:Router, private dialog: MatDialog){
    this.obtenerCliente();
  }
  
  obtenerCliente(){
    this.clienteService.lista().subscribe({
      next:(data)=>{
        if(data.length > 0){
          console.log('Cliente obtenido: ', data);
          this.listaCliente = data;
        }
      }, 
      error:(err)=>{
        console.log(err.message);
      }
    });
  }

  eliminar(cliente: ICliente){
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      width: '350px',
      data: { mensaje: `¿Está seguro de eliminar al cliente ${cliente.nombres} ${cliente.apellidos}?` }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteService.eliminar(cliente.id).subscribe({
          next: (data) => {
            if (data.isSuccess) {
              this.obtenerCliente();
            }
          },
          error: (err) => {
            console.log(err.message);
          }
        });
      }
    });
  }
  
  getFechaRegistro(fecha: string): string{
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  nuevo(){
    this.router.navigate(['cliente/cliente-registro',0]);
  }

  editar(cliente: ICliente){
    this.router.navigate(['cliente/cliente-editar',cliente.id]);
  }
}
