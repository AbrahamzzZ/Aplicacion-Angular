import { Component, inject, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import jwt_decode from 'jwt-decode';
import { IToken } from '../../models/token';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  public fechaActual: string = '';
  public horaActual: string = '';
  public nombreUsuario: string = ''; 
  private loginServicio = inject(LoginService);

  constructor(private router: Router) {
    this.actualizarFechaHora();
    setInterval(() => this.actualizarFechaHora(), 1000); // Actualiza la hora cada segundo
  }

  ngOnInit(): void {
    this.obtenerNombreUsuario();
  }

  private actualizarFechaHora(): void {
    const ahora = new Date();
    this.fechaActual = ahora.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    this.horaActual = ahora.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  private obtenerNombreUsuario(): void {
    const token = this.loginServicio.obtenerToken();
    if (token) {
      try {
        // Decodificar el token y obtener el nombre
        /*const decodedToken: IToken = jwt_decode(token);
        this.nombreUsuario =  decodedToken.nombre_completo || 'Usuario';*/
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.nombreUsuario = 'Usuario';
      }
    }
  }

  cerrarSesion(){
    this.loginServicio.eliminarToken();
    this.router.navigate(['/login']);
  }
}
