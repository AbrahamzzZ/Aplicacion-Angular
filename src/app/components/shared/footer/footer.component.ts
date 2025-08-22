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
  public autor = 'Abraham Andres Farfan Sanchez';
  public telefono = '0987654321';
  public year: number = new Date().getFullYear();
}
