import { Component, inject, OnDestroy, OnInit, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OfertaService } from '../../../services/oferta.service';
import { IOferta } from '../../models/oferta';
import { Subscription, interval } from 'rxjs';
import { FormatoFechaPipe } from '../../pipes/formato-fecha.pipe';
import * as L from 'leaflet';
import { ISucursal } from '../../models/sucursal';

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
  /*@Input() latitud!: number;
  @Input() longitud!: number;*/
  @Input() latitud: number = -2.203816;   // ejemplo: coordenadas de Guayaquil
@Input() longitud: number = -79.897454;

  private map: L.Map | undefined;

  ngOnInit(): void {
    this.obtenerOfertas();
    this.initMap();
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

  private initMap(): void {
    this.map = L.map('map').setView([this.latitud, this.longitud], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([this.latitud, this.longitud]).addTo(this.map)
      .bindPopup('Sucursal')
      .openPopup();
  }

  public sucursalSeleccionada?: ISucursal;

  mostrarMapa(sucursal: ISucursal) {
    this.sucursalSeleccionada = sucursal;
  }
}