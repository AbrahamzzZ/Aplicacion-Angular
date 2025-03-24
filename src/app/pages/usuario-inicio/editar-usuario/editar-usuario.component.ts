import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Validaciones } from '../../../../utility/validaciones';
import { UsuarioService } from '../../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUsuario } from '../../../models/usuario';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss'
})
export class EditarUsuarioComponent implements OnInit{
  private usuarioServicio = inject(UsuarioService);
  private activatedRoute = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);
  idUsuario!: number;

  formUsuario = this.formBuilder.nonNullable.group({
    nombreCompleto: ['', [Validators.required, Validaciones.soloLetras()]],
    clave: ['', [Validators.required, Validaciones.formatoClave()]],
    correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    estado: [false]
  });

  constructor(private router: Router) {}
      
    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        this.idUsuario = +params['id']; 
        if (this.idUsuario) {
          this.cargarUsuario();
        }
      });
    }
      
    cargarUsuario(): void {
      this.usuarioServicio.obtener(this.idUsuario).subscribe({
        next: (data) => {
          if (data) {
            this.formUsuario.patchValue({
                nombreCompleto: data.nombre_Completo,
                correoElectronico: data.correo_Electronico,
                clave: data.clave,
                estado: data.estado
              });
            }
          },
          error: (err) => {
        console.error('Error al obtener proveedor:', err);
        }
      });
    }

  editarUsuario(): void{
    const usuario: Partial<IUsuario> = {
      id: this.idUsuario,
      nombre_Completo: this.formUsuario.value.nombreCompleto!,
      clave: this.formUsuario.value.clave!,
      correo_Electronico: this.formUsuario.value.correoElectronico!,
      estado: this.formUsuario.value.estado
    };

    this.usuarioServicio.editar(usuario).subscribe({
      next:(data)=>{
        if(data.isSuccess){
          this.router.navigate(['/usuario']);
          this.mostrarMensaje('✔ Usuario editado correctamente.');
        }
      }, 
      error:(err)=>{
        console.log(err);
        this.mostrarMensaje('❌ Error al editar la información del usuario.');
      }
    });
  }
  
  regresar(){
    this.router.navigate(["/usuario"]);
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Módulo Usuario', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
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
