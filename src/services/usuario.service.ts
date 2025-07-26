import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { IUsuario } from '../app/interfaces/usuario';
import { IApi } from '../app/interfaces/api';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Usuario';

  constructor() {}

  lista() {
    return this.http.get<IUsuario[]>(this.apiUrl);
  }

  obtener(id: number) {
    return this.http.get<IUsuario>(`${this.apiUrl}/${id}`);
  }

  registrar(usuario: IUsuario) {
    return this.http.post<IApi>(this.apiUrl, usuario);
  }

  editar(usuario: Partial<IUsuario>) {
    return this.http.put<IApi>(this.apiUrl, usuario);
  }

  eliminar(id: number) {
    return this.http.delete<IApi>(`${this.apiUrl}/${id}`);
  }
}
