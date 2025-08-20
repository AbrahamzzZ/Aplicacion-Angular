import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/api/appsettings';
import { IMenu } from '../app/interfaces/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Menu';

  constructor() { }

  obtener(id: number){
    return this.http.get<IMenu[]>(`${this.apiUrl}/${id}`);
  }
}
