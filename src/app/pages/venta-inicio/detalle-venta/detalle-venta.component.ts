import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VentaService } from '../../../../services/venta.service';

@Component({
  selector: 'app-detalle-venta',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatSelectModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIcon, CurrencyPipe],
  templateUrl: './detalle-venta.component.html',
  styleUrl: './detalle-venta.component.scss'
})
export class DetalleVentaComponent implements OnInit{
  public venta!: FormGroup;
  public dataSource = new MatTableDataSource<any>();
  public columnasTabla: string[] = ['id', 'nombre', 'precio_Venta', 'cantidad', 'subTotal', 'descuento'];

  constructor(private fb: FormBuilder, private servicio: VentaService){}

  ngOnInit(): void {
    this.venta = this.fb.group({
      fecha: [''],
      tipoDocumento: [''],
      codigoUsuario: [''],
      nombreUsuario: [''],
      nombresCliente: [''],
      apellidosCliente: [''],
      cedulaCliente: [''],
      codigoOferta: [''],
      nombreOferta: [''],
      descuentoOferta: [''],
      totalPagar: [''],
      pagaCon: [''],
      cambio: [''],
      conDescuento: ['']
    });
  }

  filtrarVenta(numeroDocumento: string){
    if (!numeroDocumento.trim()) return;

    this.servicio.obtener(numeroDocumento).subscribe({
      next: (venta) => {
        const fechaFormateada = formatDate(venta.fecha_Venta, 'dd/MM/yyyy', 'en-US');
        this.venta.patchValue({
          fecha: fechaFormateada,
          tipoDocumento: venta.tipoDocumento,
          codigoUsuario: venta.oUsuario.id,
          nombreUsuario: venta.oUsuario.nombre_Completo,
          nombresCliente: venta.oCliente.nombres,
          apellidosCliente: venta.oCliente.apellidos,
          cedulaCliente: venta.oCliente.cedula,
          codigoOferta: venta.oOferta?.id,
          nombreOferta: venta.oOferta?.nombre,
          descuentoOferta: venta.oOferta?.descuento,
          totalPagar: venta.montoTotal,
          pagaCon: venta.montoPago,
          cambio: venta.montoCambio,
          conDescuento: venta.descuento
        });

        this.dataSource.data = venta.detalleVenta;
        console.log(this.dataSource.data);
      },
      error: (err) => {
        console.error('Error al obtener venta:', err);
      }
    });
  }

  descargarPDF(){

  }

  limpiar(){
    this.venta.reset();
    this.dataSource.data = [];
  }
}
