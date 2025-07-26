import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { ICompra } from '../app/interfaces/compra';
import { IApi } from '../app/interfaces/api';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Compra';
  constructor() { }

  obtenerNuevoNumeroDocumento(){
    return this.http.get<{ numeroDocumento: string }>(`${this.apiUrl}/nuevo-numero-documento`);
  }

  obtener(documento: string){
    return this.http.get<ICompra>(`${this.apiUrl}/documento/${documento}`);
  }

  obtenerDetalleCompra(id: number){
    return this.http.get<ICompra>(`${this.apiUrl}/${id}`);
  }

  registrar(compra: ICompra){
    return this.http.post<IApi>(this.apiUrl, compra);
  }
}
