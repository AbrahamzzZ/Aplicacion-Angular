import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VentaService } from '../../../../services/venta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-detalle-venta',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatSelectModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIcon, CurrencyPipe],
  templateUrl: './detalle-venta.component.html',
  styleUrl: './detalle-venta.component.scss'
})
export class DetalleVentaComponent implements OnInit{
  public mensajeBusqueda: string = '';
  public venta!: FormGroup;
  private snackBar = inject(MatSnackBar);
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
      totalPagar: [''],
      pagaCon: [''],
      cambio: [''],
      conDescuento: ['']
    });
  }

  filtrarVenta(numeroDocumento: string){
    this.mensajeBusqueda = '';
    if (!numeroDocumento.trim()) return;

    if (numeroDocumento.length != 5) {
      this.limpiar(); 
      this.mensajeBusqueda = 'No existe ningún detalle de venta con ese número de documento.';
      return;
    }

    this.servicio.obtener(numeroDocumento).subscribe({
      next: (venta) => {
        const fechaFormateada = formatDate(venta.fecha_Venta, 'dd/MM/yyyy', 'en-US');
        this.venta.patchValue({
          fecha: fechaFormateada,
          tipoDocumento: venta.tipoDocumento,
          codigoUsuario: venta.oUsuario.codigo,
          nombreUsuario: venta.oUsuario.nombre_Completo,
          nombresCliente: venta.oCliente.nombres,
          apellidosCliente: venta.oCliente.apellidos,
          cedulaCliente: venta.oCliente.cedula,
          totalPagar: venta.montoTotal,
          pagaCon: venta.montoPago,
          cambio: venta.montoCambio,
          conDescuento: venta.descuento
        });

        this.dataSource.data = venta.detalleVenta;
      },
      error: (err) => {
        console.error(err.message);
        this.mostrarMensaje('Error al obtener venta:', 'error');
      }
    });
  }

  descargarPDF(){
    const doc = new jsPDF();
    const logoUrl = 'assets/images/logo.png';
    const img = new Image();
    img.src = logoUrl;

    img.onload = () => {
      doc.addImage(img, 'PNG', 10, 10, 30, 30);

      doc.setFontSize(16);
      doc.text('Comprobante de Venta', 50, 20);

      doc.setFontSize(11);
      doc.text(`Fecha: ${this.venta.value.fecha}`, 10, 50);
      doc.text(`Vendedor: ${this.venta.value.nombreUsuario} (Código: ${this.venta.value.codigoUsuario})`, 10, 58);
      doc.text(`Cliente: ${this.venta.value.nombresCliente} ${this.venta.value.apellidosCliente}`, 10, 66);
      doc.text(`Cédula: ${this.venta.value.cedulaCliente}`, 10, 72);

      // Columnas de la tabla
      const columnas = [
        { header: 'Producto', dataKey: 'nombre' },
        { header: 'Cantidad', dataKey: 'cantidad' },
        { header: 'Precio', dataKey: 'precio_Venta' },
        { header: 'Subtotal', dataKey: 'subTotal' },
        { header: 'Descuento', dataKey: 'descuento'}
      ];

      // Filas de datos 
      const filas = this.dataSource.data.map(item => ({
        nombre: item.oProducto.nombre,
        cantidad: item.cantidad,
        precio_Venta: `$${item.precio_Venta.toFixed(2)}`,
        subTotal: `$${item.subTotal.toFixed(2)}`,
        descuento: `${item.descuento}%`
      }));

      autoTable(doc, {
        columns: columnas,
        body: filas,
        startY: 80,
        styles: { halign: 'center' },
        columnStyles: {
          precio_Venta: { halign: 'right' },
          subTotal: { halign: 'right' },
          descuento: { halign: 'right' },
          cantidad: { halign: 'right' }
        }
      });

      // Total general al final
      const finalY = (doc as any).lastAutoTable.finalY || 80;

      doc.setFontSize(12);
      doc.text(`Total a pagar: $${parseFloat(this.venta.value.totalPagar).toFixed(2)}`, 10, finalY + 10);
      doc.text(`Pagó con: $${parseFloat(this.venta.value.pagaCon).toFixed(2)}`, 10, finalY + 16);
      doc.text(`Cambio: $${parseFloat(this.venta.value.cambio).toFixed(2)}`, 10, finalY + 22);

      doc.save('detalle_venta.pdf');
    };
  }

  limpiar(){
    this.venta.reset();
    this.dataSource.data = [];
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' = 'success') {
    const className = tipo === 'success' ? 'success-snackbar' : 'error-snackbar';
    
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: [className]
    });
  }
}