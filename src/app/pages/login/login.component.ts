import { Component, inject, NgModule, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { ILogin } from '../../models/login';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIcon,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  hide = true;
  private loginServicio = inject(LoginService);
  public loginForm!: FormGroup;
  private snackBar = inject(MatSnackBar);

  constructor(private router: Router){}
  
  ngOnInit() {
    this.loginForm = new FormGroup({
      correoElectronico: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      clave: new FormControl('', [
        Validators.required
      ])
    });
  }

  login() {
    if (this.loginForm.valid) {
      const credenciales: ILogin = {
        correoElectronico: this.loginForm.get('correoElectronico')?.value,
        clave: this.loginForm.get('clave')?.value
      };
        this.loginServicio.login(credenciales).subscribe({
          next: (response: any) => {
  
            // Guardar el token en el almacenamiento local
            this.loginServicio.guardarToken(response.token);
  
            if(response){
              this.mostrarMensaje('Inicio de sesión exitoso', 'success');
              this.router.navigate(['/home']);
            }
          },
          error: (error) => {
            this.mostrarMensaje('Correo o clave incorrecta.', 'error');
          }
        });
    }
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' = 'success') {
    const className = tipo === 'success' ? 'success-snackbar' : 'error-snackbar';
    
    this.snackBar.open(mensaje, 'Bienvenido al Sistema', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: [className]
    });
  }
}
