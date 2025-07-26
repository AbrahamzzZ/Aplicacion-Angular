import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { INegocio } from '../app/interfaces/negocio';
import { IApi } from '../app/interfaces/api';

@Injectable({
  providedIn: 'root'
})
export class NegocioService {
  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Negocio';
  constructor() {}

  obtener(id: number) {
    return this.http.get<INegocio>(`${this.apiUrl}/${id}`);
  }

  editar(negocio: Partial<INegocio>) {
    return this.http.put<IApi>(this.apiUrl, negocio);
  }

  obtenerProductosComprados(){
    return this.http.get<IApi>(`${this.apiUrl}/producto-mas-comprado`);
  }

  obtenerProveedorPreferencia(){
    return this.http.get<IApi>(`${this.apiUrl}/proveedor-preferido`);
  }

  obtenerTransportistaViajesRealizados(){
    return this.http.get<IApi>(`${this.apiUrl}/transportista-viajes-realizados`);
  }

  obtenerProductosVendidos(){
    return this.http.get<IApi>(`${this.apiUrl}/producto-mas-vendido`);
  }

  obtenerTopClientes(){
    return this.http.get<IApi>(`${this.apiUrl}/top-clientes`);
  }

  obtenerVentaEmpleados(){
    return this.http.get<IApi>(`${this.apiUrl}/empleados-productivos`);
  }
}
