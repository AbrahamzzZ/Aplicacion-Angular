import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin } from '../app/models/login';
import { Observable } from 'rxjs';
import { appsettings } from '../setting/appsettings';
import { ITokenData } from '../app/models/itoken-data';
import { jwtDecode } from 'jwt-decode';

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

  // Método para decodificar y obtener datos del token
  obtenerDatosToken(): ITokenData | null {
    const token = this.obtenerToken();
    if (token) {
      const decoded: any = jwtDecode(token);

      const data: ITokenData = {
        nameid: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        postal_code: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/postalcode'],
        unique_name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        exp: decoded.exp,
        iss: decoded.iss,
        aud: decoded.aud
      };

      return data;
    }
    return null;
  }

  obtenerPermisosDesdeToken(): string[] {
    const token = localStorage.getItem('token');
    if (!token) return [];
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    const permisos = payload['permiso']; // puede ser un string o array
  
    return Array.isArray(permisos) ? permisos : [permisos];
  }
}
