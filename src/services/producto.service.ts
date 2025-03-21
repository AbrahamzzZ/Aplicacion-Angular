import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { IProducto } from '../app/models/producto';
import { IApi } from '../app/models/api';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl+"Producto";
  constructor() { }

  lista(){
      return this.http.get<IProducto[]>(this.apiUrl);
  }
  
  obtener(id:number){
      return this.http.get<IProducto[]>(`${this.apiUrl}/${id}`);
  }
  
  registrar(producto:IProducto){
      return this.http.post<IApi>(this.apiUrl, producto);
  }
  
  editar(producto:IProducto){
      return this.http.put<IApi>(this.apiUrl, producto);
  }
  
  eliminar(id: number){
      return this.http.delete<IApi>(`${this.apiUrl}/${id}`);
  }
}
