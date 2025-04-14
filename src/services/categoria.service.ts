import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { ICategoria } from '../app/models/categoria';
import { IApi } from '../app/models/api';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Categoria';
  constructor() { }

  lista() {
    return this.http.get<ICategoria[]>(this.apiUrl);
  }

  obtener(id: number) {
    return this.http.get<ICategoria>(`${this.apiUrl}/${id}`);
  }

  registrar(categoria: ICategoria) {
    return this.http.post<IApi>(this.apiUrl, categoria);
  }

  editar(categoria: Partial<ICategoria>) {
    return this.http.put<IApi>(this.apiUrl, categoria);
  }

  eliminar(id: number) {
    return this.http.delete<IApi>(`${this.apiUrl}/${id}`);
  }
}
