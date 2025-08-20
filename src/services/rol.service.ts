import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { appsettings } from "../setting/api/appsettings";
import { IRol } from "../app/interfaces/rol";

@Injectable({
  providedIn: 'root'
})
export class RolService{
    private http = inject(HttpClient);
    private apiUrl: string = appsettings.apiUrl + 'Rol';
    constructor() {}
    
    lista() {
      return this.http.get<IRol[]>(this.apiUrl);
    }
}