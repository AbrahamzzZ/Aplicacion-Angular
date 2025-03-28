import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Validaciones } from '../../../../utility/validaciones';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { IUsuario } from '../../../models/usuario';
import { UsuarioService } from '../../../../services/usuario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Metodos } from '../../../../utility/metodos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { CanComponentDeactive } from '../../../guards/formulario-incompleto.guard';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.scss'
})
export class RegistroUsuarioComponent implements OnInit, CanComponentDeactive{
  @Input('id') idUsuario!: number;
  private route = inject(ActivatedRoute);
  private usuarioServicio = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);
  
  public formUsuario = this.formBuilder.nonNullable.group({
    codigo: [Metodos.generarCodigo()],
    nombreCompleto: ['', [Validators.required, Validaciones.soloLetras(), Validators.maxLength(30)]],
    clave: ['', [Validators.required, Validaciones.formatoClave()]],
    correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    estado: [false]
  });

  constructor(private router:Router) {
  }

  ngOnInit(): void {
    if(this.route.snapshot.params['id']){
      this.idUsuario = parseInt(this.route.snapshot.params['id']);
    }
  }

  registrarUsuario(){
    const usuario: IUsuario = {
      id: this.idUsuario || 0,
      codigo: Metodos.generarCodigo(),
      nombre_Completo: this.formUsuario.value.nombreCompleto?.trim() ?? '',
      clave: this.formUsuario.value.clave ?? '',
      correo_Electronico: this.formUsuario.value.correoElectronico?.trim() ?? '',
      estado: this.formUsuario.value.estado ?? false,
      fecha_Creacion: Metodos.getFechaCreacion()
    };
    
    if (!this.formUsuario.valid) {
      console.log('Formulario inválido:', this.formUsuario);
      return;
    }
    
    this.usuarioServicio.registrar(usuario).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          this.mostrarMensaje('✔ Usuario registrado correctamente.');
          this.router.navigate(['/usuario'], {skipLocationChange: true});
        }
      },error: (err: HttpErrorResponse) => {
        console.log('Error 400:', err.error);
        if (err.error?.errors) {
          Object.entries(err.error.errors).forEach(([campo, errores]) => {
            console.log(`Error en ${campo}:`, errores);
          });
          this.mostrarMensaje('❌ Error al registrar al usuario.');
        }
      }
    });
  }

  regresar(){
    this.router.navigate(["/usuario"])
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Módulo Usuario', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  canDeactive(): boolean | Observable<boolean>{
    const camposEditables = ['nombreCompleto', 'clave', 'correoElectronico'];
    const camposVacios = camposEditables.some(campo => this.formUsuario.get(campo)?.value === '');
    const camposConDatos = camposEditables.some(campo => this.formUsuario.get(campo)?.value !== '');
      
    return camposConDatos && camposVacios ? false : true;
  }

  get nombreCompletoField(): FormControl<string> {
    return this.formUsuario.controls.nombreCompleto;
  }

  get claveField(): FormControl<string> {
    return this.formUsuario.controls.clave;
  }

  get correoElectronicoField(): FormControl<string> {
    return this.formUsuario.controls.correoElectronico;
  }
}