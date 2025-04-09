import { Component, inject, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { MenuService } from '../../../services/menu.service';
import { IMenu } from '../../models/menu';

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
  public menus: IMenu[] = [];
  private loginServicio = inject(LoginService);
  private menuServicio = inject(MenuService);

  constructor(private router: Router) {
    this.actualizarFechaHora();
    setInterval(() => this.actualizarFechaHora(), 1000); // Actualiza la hora cada segundo
  }

  ngOnInit(): void {
    const datosToken = this.loginServicio.obtenerDatosToken();

    if (datosToken) {
      this.nombreUsuario = datosToken.unique_name; // Mostrar nombre del usuario en el menú
      const idUsuario = datosToken.nameid;

      this.menuServicio.obtener(idUsuario).subscribe({
        next: (data) => {
          this.menus = data;
        },
        error: (err) => {
          console.error('Error al cargar los menús:', err);
        }
      });
    }
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

  cerrarSesion(){
    this.loginServicio.eliminarToken();
    this.router.navigate(['/login']);
  }
}
