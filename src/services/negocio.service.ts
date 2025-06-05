import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { INegocio } from '../app/models/negocio';
import { IApi } from '../app/models/api';

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
}
