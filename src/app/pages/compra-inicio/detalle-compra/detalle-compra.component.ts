import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CompraService } from '../../../../services/compra.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-detalle-compra',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatSelectModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIcon, CurrencyPipe],
  templateUrl: './detalle-compra.component.html',
  styleUrl: './detalle-compra.component.scss'
})
export class DetalleCompraComponent {
  public mensajeBusqueda: string = '';
  public compra!: FormGroup;
  private snackBar = inject(MatSnackBar);
  private servicio = inject(CompraService);
  public dataSource = new MatTableDataSource<any>();
  public columnasTabla: string[] = ['id', 'nombre', 'precio_Compra', 'precio_Venta', 'cantidad', 'subTotal'];

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.compra = this.fb.group({
      fecha: [''],
      tipoDocumento: [''],
      codigoUsuario: [''],
      nombreUsuario: [''],
      nombresProveedor: [''],
      apellidosProveedor: [''],
      cedulaProveedor: [''],
      nombresTransportista: [''],
      apellidosTransportista: [''],
      cedulaTransportista: [''],
      totalPagar: [''],
    });
  }

  filtrarCompra(numeroDocumento: string){
  this.mensajeBusqueda = '';
  if (!numeroDocumento.trim()) return;

  if (numeroDocumento.length != 5) {
    this.limpiar(); 
    this.mensajeBusqueda = 'No existe ningún detalle de compra con ese número de documento.';
    return;
  }

  this.servicio.obtener(numeroDocumento).subscribe({
    next: (compra) => {

      this.compra.patchValue({
        fecha: compra.fecha_Compra,
        tipoDocumento: compra.tipo_Documento,
        codigoUsuario: compra.codigo_Usuario,
        nombreUsuario: compra.nombre_Completo,
        nombresProveedor: compra.nombres_Proveedor,
        apellidosProveedor: compra.apellidos_Proveedor,
        cedulaProveedor: compra.cedula_Proveedor,
        nombresTransportista: compra.nombres_Transportista,
        apellidosTransportista: compra.apellidos_Transportista,
        cedulaTransportista: compra.cedula_Transportista,
        totalPagar: compra.monto_Total,
      });

      this.servicio.obtenerDetalleCompra(compra.id_Compra).subscribe({
        next: (detalle) => {

          this.dataSource.data = Array.isArray(detalle) ? detalle : [detalle];
        },
        error: (err) => {
          console.error(err.message);
          this.mostrarMensaje('Error al obtener el detalle de compra.', 'error');
        }
      });
    },
    error: (err) => {
      console.error(err.message);
      this.mostrarMensaje('Error al obtener compra.', 'error');
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
      doc.text(`Fecha: ${this.compra.value.fecha}`, 10, 50);
      doc.text(`Vendedor: ${this.compra.value.nombreUsuario} (Código: ${this.compra.value.codigoUsuario})`, 10, 58);
      doc.text(`Cliente: ${this.compra.value.nombresProveedor} ${this.compra.value.apellidosProveedor}`, 10, 66);
      doc.text(`Cédula: ${this.compra.value.cedulaProveedor}`, 10, 72);
      doc.text(`Cliente: ${this.compra.value.nombresTransportista} ${this.compra.value.apellidosTransportista}`, 10, 66);
      doc.text(`Cédula: ${this.compra.value.cedulaTransportista}`, 10, 72);

      // Columnas de la tabla
      const columnas = [
        { header: 'Producto', dataKey: 'nombre' },
        { header: 'Cantidad', dataKey: 'cantidad' },
        { header: 'Precio Compra', dataKey: 'precio_Compra' },
        { header: 'Precio Venta', dataKey: 'precio_Venta' },
        { header: 'Subtotal', dataKey: 'subTotal' }
      ];

      // Filas de datos 
      const filas = this.dataSource.data.map(item => ({
        nombre: item.productos,
        cantidad: item.cantidad,
        precio_Compra: `$${item.precio_Venta.toFixed(2)}`,
        precio_Venta: `$${item.precio_Venta.toFixed(2)}`,
        subTotal: `$${item.subTotal.toFixed(2)}`,
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
      doc.text(`Total a pagar: $${parseFloat(this.compra.value.totalPagar).toFixed(2)}`, 10, finalY + 10);

      doc.save('detalle_compra.pdf');
    };
  }
  
  limpiar(){
    this.compra.reset();
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
