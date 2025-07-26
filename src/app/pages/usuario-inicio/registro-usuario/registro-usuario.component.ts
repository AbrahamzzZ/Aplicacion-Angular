import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Validaciones } from '../../../../utility/validaciones';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { IUsuario } from '../../../interfaces/usuario';
import { UsuarioService } from '../../../../services/usuario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Metodos } from '../../../../utility/metodos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { CanComponentDeactive } from '../../../guards/formulario-incompleto.guard';
import { RolService } from '../../../../services/rol.service';
import { IRol } from '../../../interfaces/rol';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    MatCardModule,
    MatInput,
    MatFormFieldModule,
    MatButton,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.scss'
})
export class RegistroUsuarioComponent implements OnInit, CanComponentDeactive {
  @Input('id') idUsuario!: number;
  private route = inject(ActivatedRoute);
  private usuarioServicio = inject(UsuarioService);
  private rolServicio = inject(RolService);
  public roles:IRol [] = [];
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);

  public formUsuario = this.formBuilder.nonNullable.group({
    codigo: [Metodos.generarCodigo()],
    nombreCompleto: [
      '',
      [Validators.required, Validaciones.soloLetras(), Validators.maxLength(70)]
    ],
    clave: ['', [Validators.required, Validaciones.formatoClave()]],
    correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    rol: [0, [Validators.required, Validaciones.rolRequerido()]],
    estado: [false]
  });

  @HostListener('window:beforeunload', ['$event'])
  onBeforeReload(e: BeforeUnloadEvent) {
    const camposEditables = ['nombreCompleto', 'clave', 'correoElectronico'];
    const camposConDatos = camposEditables.some(
      (campo) => this.formUsuario.get(campo)?.value !== ''
    );

    if (camposConDatos) {
      e.preventDefault();
      e.returnValue = ''; // Esto es necesario para mostrar el mensaje de confirmación en algunos navegadores.
    }
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.idUsuario = parseInt(this.route.snapshot.params['id']);
    }

    this.rolServicio.lista().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Error al obtener los roles:', err);
      }
    });
  }

  registrarUsuario() {
    const rolId = this.formUsuario.value.rol;
    const rolSeleccionado = this.roles.find(p => p.id === rolId)?? {} as IRol;

    const usuario: IUsuario = {
      id: this.idUsuario || 0,
      codigo: Metodos.generarCodigo(),
      nombre_Completo: this.formUsuario.value.nombreCompleto?.trim() ?? '',
      clave: this.formUsuario.value.clave ?? '',
      correo_Electronico: this.formUsuario.value.correoElectronico?.trim() ?? '',
      oRol: rolSeleccionado,
      estado: this.formUsuario.value.estado ?? false,
      fecha_Creacion: Metodos.getFechaCreacion()
    };

    this.formUsuario.markAllAsTouched();

    if (!this.formUsuario.valid) {
      this.mostrarMensaje('Formulatio inválido', 'error');
      return;
    }

    this.usuarioServicio.registrar(usuario).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          this.router.navigate(['/usuario'], { skipLocationChange: true });
          this.mostrarMensaje('¡Usuario registrado exitosamente!', 'success');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error 400:', err.error);
        if (err.error?.errors) {
          Object.entries(err.error.errors).forEach(([campo, errores]) => {
            console.log(`Error en ${campo}:`, errores);
          });
          this.mostrarMensaje('Error al registrar el Usuario', 'error');
        }
      }
    });
  }

  regresar() {
    this.router.navigate(['/usuario']);
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' = 'success') {
    const className = tipo === 'success' ? 'success-snackbar' : 'error-snackbar';
    
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: [className]
    });
  }

  canDeactive(): boolean | Observable<boolean> {
    const camposEditables = ['nombreCompleto', 'clave', 'correoElectronico'];
    const camposVacios = camposEditables.some((campo) => this.formUsuario.get(campo)?.value === '');
    const camposConDatos = camposEditables.some(
      (campo) => this.formUsuario.get(campo)?.value !== ''
    );

    return camposConDatos && camposVacios ? false : true;
  }

  rolSeleccionado(event: MatSelectChange) {
    const rolId = event.value;
    this.formUsuario.controls.rol.setValue(rolId);
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

  get rolSeleccionadoField(): FormControl<number> {
    return this.formUsuario.controls.rol;
  }
}
