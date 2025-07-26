import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NegocioService } from '../../../../services/negocio.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { MatButtonModule } from '@angular/material/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-estadistica-negocio',
  standalone: true,
  imports: [MatCardModule, NgChartsModule, MatButtonModule],
  templateUrl: './estadistica-negocio.component.html',
  styleUrl: './estadistica-negocio.component.scss'
})
export class EstadisticaNegocioComponent {

  private negocioService = inject(NegocioService);
  private snackBar = inject(MatSnackBar);
  public chartType: ChartType = 'bar';

  public chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: '',
        backgroundColor: [],
      }
    ]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  private generarColores(cantidad: number): string[] {
    const coloresBase = ['#42A5F5', '#66BB6A', '#FFA726', '#26A69A', '#AB47BC', '#EF5350', '#8D6E63'];
    let colores: string[] = [];
    for (let i = 0; i < cantidad; i++) {
      colores.push(coloresBase[i % coloresBase.length]);
    }
    return colores;
  }

  public chartPlugins = [];

  verEstadisticas1(){
    this.negocioService.obtenerProductosComprados().subscribe(data => {
      this.chartData = {
        labels: data.map(item => item.nombreProducto),
        datasets: [
          {
            data: data.map(item => item.cantidadComprada),
            label: 'Cantidad Comprada',
            backgroundColor: this.generarColores(data.length)
          }
        ]
      };
      this.chartType = 'bar';
    });
  }

  verEstadisticas2(){
    this.negocioService.obtenerProductosVendidos().subscribe(data => {
      this.chartData = {
        labels: data.map(item => item.nombreProducto),
        datasets: [
          {
            data: data.map(item => item.cantidadVendida),
            label: 'Cantidad Vendida',
            backgroundColor: this.generarColores(data.length)
          }
        ]
      };
      this.chartType = 'bar';
    });
  }

  verEstadisticas3(){
    this.negocioService.obtenerVentaEmpleados().subscribe(data => {
      this.chartData = {
        labels: data.map(item => item.nombreCompleto),
        datasets: [
          {
            data: data.map(item => item.ventasRealizadas),
            label: 'Ventas Realizadas',
            backgroundColor: this.generarColores(data.length)
          }
        ]
      };
      this.chartType = 'pie';
    });
  }

  verEstadisticas4(){
    this.negocioService.obtenerTopClientes().subscribe(data => {
      this.chartData = {
        labels: data.map(item => item.nombreCompleto),
        datasets: [
          {
            data: data.map(item => item.cantidadCompras),
            label: 'Compras Totales',
            backgroundColor: this.generarColores(data.length)
          }
        ]
      };
      this.chartType = 'bar';
    });
  }

  verEstadisticas5(){
    this.negocioService.obtenerProveedorPreferencia().subscribe(data => {
      this.chartData = {
        labels: data.map(item => item.nombreCompleto),
        datasets: [
          {
            data: data.map(item => item.comprasTotales),
            label: 'Compras Totales',
            backgroundColor: this.generarColores(data.length)
          }
        ]
      };
      this.chartType = 'pie';
    });
  }

  verEstadisticas6(){
    this.negocioService.obtenerTransportistaViajesRealizados().subscribe(data => {
      this.chartData = {
        labels: data.map(item => item.nombreCompleto),
        datasets: [
          {
            data: data.map(item => item.viajesTotales),
            label: 'Compras Totales',
            backgroundColor: this.generarColores(data.length)
          }
        ]
      };
      this.chartType = 'pie';
    });
  }

  descargarPDF(): void {
    const chartElement = document.querySelector('.estadistica-negocio__grafico-contenedor') as HTMLElement;

    if (!chartElement || chartElement.clientHeight === 0) {
      console.error('El gráfico no está visible o no tiene datos.');
      this.mostrarMensaje('No se encontró el gráfico o no hay datos para mostrar.', 'error');
      return; 
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const logoUrl = 'assets/images/logo.png';
    const img = new Image();
    img.src = logoUrl;

    img.onload = () => {

      doc.addImage(img, 'PNG', 10, 10, 30, 30);
      doc.setFontSize(16);
      doc.text('Reporte Estadístico del Negocio', 50, 20);

      doc.setFontSize(11);
      const fecha = new Date().toLocaleString();
      doc.text(`Fecha de generación: ${fecha}`, 10, 50);

      html2canvas(chartElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = doc.internal.pageSize.getWidth() - 20;
        const imgProps = doc.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        const startY = 70;
        doc.addImage(imgData, 'PNG', 10, startY, pdfWidth, pdfHeight);
        doc.save('reporte_estadistico_negocio.pdf');
      });
    };
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
