import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { IProveedor } from '../app/models/proveedor';
import { IApi } from '../app/models/api';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl+"Proveedor";

  constructor() { }

  lista(){
    return this.http.get<IProveedor[]>(this.apiUrl);
  }
    
  obtener(id:number){
    return this.http.get<IProveedor[]>(`${this.apiUrl}/${id}`);
  }
    
  registrar(proveedor:IProveedor){
    return this.http.post<IApi>(this.apiUrl, proveedor);
  }
    
  editar(proveedor:IProveedor){
    return this.http.put<IApi>(this.apiUrl, proveedor);
  }
    
  eliminar(id: number){
    return this.http.delete<IApi>(`${this.apiUrl}/${id}`);
  }
}
