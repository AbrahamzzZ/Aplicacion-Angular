import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterOutlet],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

}
