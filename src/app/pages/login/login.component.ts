import { Component, inject, NgModule, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ILogin } from '../../interfaces/login';
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
  public hide = true;
  private loginServicio = inject(LoginService);
  public loginForm!: FormGroup;
  private snackBar = inject(MatSnackBar);

  constructor(private router: Router, private route: ActivatedRoute){}
  
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

    this.route.queryParams.subscribe(params => {
      if (params['motivo'] === 'inactividad') {
        this.mostrarMensaje('La sesión fue cerrada por inactividad', 'error');
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['motivo'] === 'sesion') {
        this.mostrarMensaje('La sesión fue cerrada exitosamente', 'success');
      }
    });
  }

  login() {
    if (this.loginForm.valid) {
      const credenciales: ILogin = {
        correo_Electronico: this.loginForm.get('correoElectronico')?.value,
        clave: this.loginForm.get('clave')?.value
      };
        this.loginServicio.login(credenciales).subscribe({
          next: (response: any) => {
            this.loginServicio.guardarToken(response.token);
  
            if(response){
              this.loginServicio.iniciarMonitoreo();
              this.mostrarMensaje('Inicio de sesión exitoso', 'success');
              this.router.navigate(['/home']);
            }
          },
          error: (error) => {
            console.error('Error al iniciar sesion: ', error);
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
