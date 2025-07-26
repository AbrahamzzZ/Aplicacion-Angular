import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { ISucursal } from '../app/interfaces/sucursal';
import { IApi } from '../app/interfaces/api';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Sucursal';
  constructor() {}

  lista() {
    return this.http.get<ISucursal[]>(this.apiUrl);
  }

  obtener(id: number) {
    return this.http.get<ISucursal>(`${this.apiUrl}/${id}`);
  }

  registrar(sucursal: ISucursal) {
    return this.http.post<IApi>(this.apiUrl, sucursal);
  }

  editar(sucursal: Partial<ISucursal>) {
    return this.http.put<IApi>(this.apiUrl, sucursal);
  }

  eliminar(id: number) {
    return this.http.delete<IApi>(`${this.apiUrl}/${id}`);
  }
}
