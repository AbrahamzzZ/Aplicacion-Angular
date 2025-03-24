import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { ICliente } from '../app/models/cliente';
import { IApi } from '../app/models/api';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl+"Cliente";
  constructor() { }

  lista(){
    return this.http.get<ICliente[]>(this.apiUrl);
  }

  obtener(id:number){
    return this.http.get<ICliente>(`${this.apiUrl}/${id}`);
  }

  registrar(cliente:ICliente){
    return this.http.post<IApi>(this.apiUrl, cliente);
  }

  editar(cliente: Partial<ICliente>){
    return this.http.put<IApi>(this.apiUrl, cliente);
  }

  eliminar(id: number){
    return this.http.delete<IApi>(`${this.apiUrl}/${id}`);
  }
}
