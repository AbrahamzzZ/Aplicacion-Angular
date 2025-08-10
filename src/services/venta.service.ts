import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { IVenta } from '../app/interfaces/venta';
import { IApi } from '../setting/api';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Venta';
  constructor() { }

  obtenerNuevoNumeroDocumento(){
    return this.http.get<{ numeroDocumento: string }>(`${this.apiUrl}/numero-documento`);
  }

  obtener(documento: string){
    return this.http.get<IVenta>(`${this.apiUrl}/${documento}`);
  }

  obtenerDetalleVenta(id: number){
    return this.http.get<IVenta>(`${this.apiUrl}/detalles/${id}`);
  }

  registrar(venta: IVenta){
    return this.http.post<IApi>(this.apiUrl, venta);
  }
}
