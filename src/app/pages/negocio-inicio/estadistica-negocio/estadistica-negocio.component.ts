import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NegocioService } from '../../../../services/negocio.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ProductoMasVendido } from '../../../interfaces/interfaces-negocio/producto-mas-vendido';
import { IApi } from '../../../interfaces/api';

@Component({
  selector: 'app-estadistica-negocio',
  standalone: true,
  imports: [MatCardModule, NgChartsModule],
  templateUrl: './estadistica-negocio.component.html',
  styleUrl: './estadistica-negocio.component.scss'
})
export class EstadisticaNegocioComponent {

  private negocioService = inject(NegocioService);
  public chartType: ChartType = 'bar';

public chartData: ChartConfiguration['data'] = {
  labels: [],
  datasets: [
    {
      data: [],
      label: '',
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26A69A', '#AB47BC'],
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

public chartPlugins = [];

  verEstadisticas1(){

  }

  verEstadisticas2(){

  }

  verEstadisticas3(){

  }

  verEstadisticas4(){

  }

  verEstadisticas5(){

  }

  verEstadisticas6(){

  }
}
