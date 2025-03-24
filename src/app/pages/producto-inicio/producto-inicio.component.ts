import { Component, inject } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { IProducto } from '../../models/producto';
import { DialogoConfirmacionComponent } from '../../components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-producto-inicio',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIcon, RouterOutlet],
  templateUrl: './producto-inicio.component.html',
  styleUrl: './producto-inicio.component.scss'
})
export class RegistroProductoInicioComponent {
  private productoServicio = inject(ProductoService);
  private snackBar = inject(MatSnackBar);
  public listaProducto: IProducto[]=[];
  public displayedColumns: string[] = ['id', 'codigo', 'descripcion', 'nombre', 'categoria', 'pais_Origen', 'stock', 'precio_Venta', 'estado', 'accion'];

  constructor(private router:Router, private dialog: MatDialog){
    this.obtenerProducto();
  }
  
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

  eliminar(producto: IProducto){
      const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
        width: '350px',
        data: { mensaje: `¿Está seguro de eliminar este producto ${producto.nombre}?` }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.productoServicio.eliminar(producto.id).subscribe({
            next: (data) => {
              if (data.isSuccess) {
                this.obtenerProducto();
                this.mostrarMensaje('✔ Producto eliminado correctamente.');
              }
            },
            error: (err) => {
              console.log(err.message);
              this.mostrarMensaje('❌ Error al eliminar el producto.');
            }
          });
        }
      });
    }

  nuevo(){
    this.router.navigate(['producto/producto-registro',0]);
  }

  editar(producto: IProducto){
    this.router.navigate(['producto/producto-editar',producto.id]);
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Módulo Producto', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  getEstado(estado: boolean): string{
    return estado ? 'Activo': 'No Activo';
  }

  getFechaRegistro(fecha: string): string{
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
