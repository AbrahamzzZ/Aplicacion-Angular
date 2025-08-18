import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { IUsuario } from '../app/interfaces/usuario';
import { IApi } from '../setting/api';
import { IUsuarioRol } from '../app/interfaces/Dto/iusuario-rol';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Usuario';

  constructor() {}

  lista() {
    return this.http.get<IUsuarioRol[]>(this.apiUrl);
  }

  listaPaginada(pageNumber: number, pageSize: number) {
    return this.http.get<{
      data: IUsuario[],
      totalCount: number
    }>(`${this.apiUrl}/paginacion?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  obtener(id: number) {
    return this.http.get<IUsuarioRol>(`${this.apiUrl}/${id}`);
  }

  registrar(usuario: IUsuario) {
    return this.http.post<IApi>(this.apiUrl, usuario);
  }

  editar(usuario: Partial<IUsuario>) {
    return this.http.put<IApi>(`${this.apiUrl}/${usuario.id_Usuario}`, usuario);
  }

  eliminar(id: number) {
    return this.http.delete<IApi>(`${this.apiUrl}/${id}`);
  }
}
