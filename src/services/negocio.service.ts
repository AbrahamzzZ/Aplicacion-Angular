import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/api/appsettings';
import { INegocio } from '../app/interfaces/negocio';
import { IApi } from '../setting/api/api';
import { ProductoMasVendido } from '../app/interfaces/Dto/producto-mas-vendido';
import { ProductoMasComprado } from '../app/interfaces/Dto/producto-mas-comprado';
import { TopClientes } from '../app/interfaces/Dto/top-clientes';
import { ProveedorPreferido } from '../app/interfaces/Dto/proveedor-preferido';
import { TransportistaViaje } from '../app/interfaces/Dto/transportista-viaje';
import { EmpleadoProductivo } from '../app/interfaces/Dto/empleado-productivo';

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
    return this.http.put<IApi>(`${this.apiUrl}/${negocio.id_Negocio}`, negocio);
  }

  obtenerProductosComprados(){
    return this.http.get<ProductoMasComprado[]>(`${this.apiUrl}/producto-mas-comprado`);
  }

  obtenerProductosVendidos(){
    return this.http.get<ProductoMasVendido[]>(`${this.apiUrl}/producto-mas-vendido`);
  }

  obtenerTopClientes(){
    return this.http.get<TopClientes[]>(`${this.apiUrl}/top-clientes`);
  }

  obtenerTopProveedores(){
    return this.http.get<ProveedorPreferido[]>(`${this.apiUrl}/top-proveedores`);
  }

  obtenerViajesTransportista(){
    return this.http.get<TransportistaViaje[]>(`${this.apiUrl}/viajes-transportista`);
  }

  obtenerVentaEmpleados(){
    return this.http.get<EmpleadoProductivo[]>(`${this.apiUrl}/empleados-productivos`);
  }
}
