import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { IProducto } from '../app/interfaces/producto';
import { IApi } from '../setting/api';
import { IProductoCategoria } from '../app/interfaces/Dto/iproducto-categoria';
import { IProductoRespuesta } from '../app/interfaces/Dto/iproducto-respuesta';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Producto';
  constructor() {}

  lista() {
    return this.http.get<IProductoCategoria[]>(this.apiUrl);
  }

  listaPaginada(pageNumber: number, pageSize: number) {
    return this.http.get<{
      data: IProducto[],
      totalCount: number
    }>(`${this.apiUrl}/paginacion?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  obtener(id: number) {
    return this.http.get<IProductoRespuesta>(`${this.apiUrl}/${id}`);
  }

  registrar(producto: IProducto) {
    return this.http.post<IApi>(this.apiUrl, producto);
  }

  editar(producto: Partial<IProducto>) {
    return this.http.put<IApi>(`${this.apiUrl}/${producto.id_Producto}`, producto);
  }

  eliminar(id: number) {
    return this.http.delete<IApi>(`${this.apiUrl}/${id}`);
  }
}
