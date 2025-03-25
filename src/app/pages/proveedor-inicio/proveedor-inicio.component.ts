import { Component, inject } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { ProveedorService } from '../../../services/proveedor.service';
import { IProveedor } from '../../models/proveedor';
import { DialogoConfirmacionComponent } from '../../components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-proveedor-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIcon, MatFormFieldModule, MatInputModule, RouterOutlet],
  templateUrl: './proveedor-inicio.component.html',
  styleUrl: './proveedor-inicio.component.scss'
})
export class RegistroProveedorInicioComponent {
  private proveedorServicio = inject(ProveedorService);
  private snackBar = inject(MatSnackBar);
  public listaProveedor = new MatTableDataSource<IProveedor>();
  public displayedColumns: string[] = ['id', 'codigo', 'nombres', 'apellidos', 'cedula', 'telefono', 'correo_Electronico', 'estado', 'fecha_Registro', 'accion'];

  constructor(private router:Router, private dialog: MatDialog){
    this.obtenerProveedor();
  }

  obtenerProveedor(){
    this.proveedorServicio.lista().subscribe({
      next:(data)=>{
       this.listaProveedor.data = data;
      },
      error:(err)=>{
        console.log(err.message);
      }
    });
  }
  
  eliminar(proveedor: IProveedor){
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      width: '350px',
      data: { mensaje: `¿Está seguro de eliminar al proveedor ${proveedor.nombres} ${proveedor.apellidos}?` }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.proveedorServicio.eliminar(proveedor.id).subscribe({
          next: (data) => {
            console.log(data);
            if (data.isSuccess) {
              this.obtenerProveedor();
              this.mostrarMensaje('✔ Proveedor eliminado correctamente.');
            }
          },
          error: (err) => {
            console.log(err.message);
            this.mostrarMensaje('❌ Error al eliminar al proveedor.');
          }
        });
      }
    });
  }

  nuevo(){
    this.router.navigate(['proveedor/proveedor-registro', 0]);
  } 

  editar(proveedor: IProveedor){
    this.router.navigate(['proveedor/proveedor-editar',proveedor.id]);
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Módulo Proveedor', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  filtrarProveedores(termino: string) {
    this.listaProveedor.filter = termino.trim().toLowerCase();
  }

  getEstado(estado: boolean): string{
    return estado ? 'Activo': 'No Activo';
  }
  
  getFechaRegistro(fecha: string): string{
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
