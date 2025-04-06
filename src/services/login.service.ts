import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin } from '../app/models/login';
import { Observable } from 'rxjs';
import { appsettings } from '../setting/appsettings';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl: string = appsettings.apiUrl + 'Usuario';;

  constructor(private http: HttpClient) {}

  login(credenciales: ILogin): Observable<any> {
    return this.http.post(`${this.apiUrl}/IniciarSesion`, credenciales);
  }

  // Método para guardar el token en localStorage
  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Método para obtener el token desde localStorage
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para eliminar el token
  eliminarToken(): void {
    localStorage.removeItem('token');
  }
}
