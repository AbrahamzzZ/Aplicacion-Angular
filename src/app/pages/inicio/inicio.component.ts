import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OfertaService } from '../../../services/oferta.service';
import { IOferta } from '../../models/oferta';
import { Subscription, interval } from 'rxjs';
import { FormatoFechaPipe } from '../../pipes/formato-fecha.pipe';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, FormatoFechaPipe],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit, OnDestroy{
  private ofertaServicio = inject(OfertaService);
  public ofertas: IOferta[] = [];
  public ofertaActual: IOferta | null = null;
  private subscripcion!: Subscription;
  private indiceOferta = 0;

  ngOnInit(): void {
    this.obtenerOfertas();
  }

  obtenerOfertas() {
    this.ofertaServicio.lista().subscribe({
      next: (data) => {
        this.ofertas = data;
        if (this.ofertas.length > 0) {
          this.iniciarRotacion();
        }
      },
      error: (err) => {
        console.error('Error al obtener las ofertas:', err);
      }
    });
  }

  iniciarRotacion() {
    this.mostrarSiguienteOferta();
    this.subscripcion = interval(5000).subscribe(() => {
      this.mostrarSiguienteOferta();
    });
  }

  mostrarSiguienteOferta() {
    if (this.ofertas.length === 0) return;
    this.ofertaActual = this.ofertas[this.indiceOferta];
    this.indiceOferta = (this.indiceOferta + 1) % this.ofertas.length;
  }

  ngOnDestroy(): void {
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
  }
}
