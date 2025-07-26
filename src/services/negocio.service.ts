import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { INegocio } from '../app/interfaces/negocio';
import { IApi } from '../app/interfaces/api';
import { ProductoMasVendido } from '../app/interfaces/interfaces-negocio/producto-mas-vendido';
import { ProductoMasComprado } from '../app/interfaces/interfaces-negocio/producto-mas-comprado';
import { TopClientes } from '../app/interfaces/interfaces-negocio/top-clientes';
import { ProveedorPreferido } from '../app/interfaces/interfaces-negocio/proveedor-preferido';
import { TransportistaViaje } from '../app/interfaces/interfaces-negocio/transportista-viaje';
import { EmpleadoProductivo } from '../app/interfaces/interfaces-negocio/empleado-productivo';

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
    return this.http.get<ProductoMasComprado[]>(`${this.apiUrl}/producto-mas-comprado`);
  }

  obtenerProveedorPreferencia(){
    return this.http.get<ProveedorPreferido[]>(`${this.apiUrl}/proveedor-preferido`);
  }

  obtenerTransportistaViajesRealizados(){
    return this.http.get<TransportistaViaje[]>(`${this.apiUrl}/transportista-viajes-realizados`);
  }

  obtenerProductosVendidos(){
    return this.http.get<ProductoMasVendido[]>(`${this.apiUrl}/producto-mas-vendido`);
  }

  obtenerTopClientes(){
    return this.http.get<TopClientes[]>(`${this.apiUrl}/top-clientes`);
  }

  obtenerVentaEmpleados(){
    return this.http.get<EmpleadoProductivo[]>(`${this.apiUrl}/empleados-productivos`);
  }
}
