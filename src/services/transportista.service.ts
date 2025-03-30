import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { ITransportista } from '../app/models/transportista';
import { IApi } from '../app/models/api';
@Injectable({
  providedIn: 'root'
})
export class TransportistaService {
  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Transportista';
  constructor() {}

  lista() {
    return this.http.get<ITransportista[]>(this.apiUrl);
  }

  obtener(id: number) {
    return this.http.get<ITransportista>(`${this.apiUrl}/${id}`);
  }

  registrar(transportista: ITransportista) {
    return this.http.post<IApi>(this.apiUrl, transportista);
  }

  editar(transportista: Partial<ITransportista>) {
    return this.http.put<IApi>(this.apiUrl, transportista);
  }

  eliminar(id: number) {
    return this.http.delete<IApi>(`${this.apiUrl}/${id}`);
  }
}
