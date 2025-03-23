import { HttpClient, HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsettings';
import { ITransportista } from '../app/models/transportista';
import { IApi } from '../app/models/api';
import { filter, map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TransportistaService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl+"Transportista";
  constructor() { }

  lista(){
      return this.http.get<ITransportista[]>(this.apiUrl);
  }
  
  obtener(id:number){
      return this.http.get<ITransportista[]>(`${this.apiUrl}/${id}`);
  }
  
  /*registrar(transportista:ITransportista){
      return this.http.post<IApi>(this.apiUrl, transportista);
  }*/
      registrar(data: FormData): Observable<IApi> {
        return this.http.post<FormData>(this.apiUrl, data, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            filter((event: { type: HttpEventType; }): event is HttpResponse<IApi> => event.type === HttpEventType.Response),
            map((event: HttpResponse<IApi>) => event.body!)
        );
    }
  
  editar(transportista:ITransportista){
      return this.http.put<IApi>(this.apiUrl, transportista);
  }
  
  eliminar(id: number){
      return this.http.delete<IApi>(`${this.apiUrl}/${id}`);
  }
}
