import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { IOferta } from '../app/interfaces/oferta';
import { IApi } from '../app/interfaces/api';

@Injectable({
  providedIn: 'root'
})
export class OfertaService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Oferta';
  constructor() { }

  lista() {
    return this.http.get<IOferta[]>(this.apiUrl);
  }
  
  obtener(id: number) {
    return this.http.get<IOferta>(`${this.apiUrl}/${id}`);
  }
  
  registrar(oferta: IOferta) {
    return this.http.post<IApi>(this.apiUrl, oferta);
  }
  
  editar(oferta: Partial<IOferta>) {
    return this.http.put<IApi>(this.apiUrl, oferta);
  }
  
  eliminar(id: number) {
    return this.http.delete<IApi>(`${this.apiUrl}/${id}`);
  }
}
