import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  autor: string = 'Abraham Andres Farfan Sanchez';
  telefono: string = '0987654321';
  year: number = new Date().getFullYear();
}
