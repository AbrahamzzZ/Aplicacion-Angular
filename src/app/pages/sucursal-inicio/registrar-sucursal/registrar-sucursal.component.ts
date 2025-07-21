import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { CanComponentDeactive } from '../../../guards/formulario-incompleto.guard';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SucursalService } from '../../../../services/sucursal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Metodos } from '../../../../utility/metodos';
import { ISucursal } from '../../../models/sucursal';
import { MatCardModule } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { Observable } from 'rxjs';
import { Validaciones } from '../../../../utility/validaciones';
import { INegocio } from '../../../models/negocio';
import { NegocioService } from '../../../../services/negocio.service';

@Component({
  selector: 'app-registrar-sucursal',
  standalone: true,
  imports: [
    MatCardModule,
    MatInput,
    MatFormFieldModule,
    MatButton,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './registrar-sucursal.component.html',
  styleUrl: './registrar-sucursal.component.scss'
})
export class RegistrarSucursalComponent implements OnInit, CanComponentDeactive{
  @Input('id') idSucursal!: number;
  private route = inject(ActivatedRoute);
  private sucursalServicio = inject(SucursalService);
  private negocioServicio = inject(NegocioService);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);
  public negocio!: INegocio;

  public formSucursal = this.formBuilder.nonNullable.group({
    codigo: [Metodos.generarCodigo()],
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ]
    ],
    direccion: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(90)
      ]
    ],
    latitud: ['', [Validators.required, Validaciones.coordenadaValida()]],
    longitud: ['', [Validators.required, Validaciones.coordenadaValida()]],
    ciudad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    estado: [false]
  });

  @HostListener('window:beforeunload', ['$event'])
  onBeforeReload(e: BeforeUnloadEvent) {
    const camposEditables = ['nombre', 'direccion', 'latitud', 'longitud', 'ciudad'];
    const camposConDatos = camposEditables.some(
      (campo) => this.formSucursal.get(campo)?.value !== ''
    );
  
    if (camposConDatos) {
      e.preventDefault();
      e.returnValue = '';  // Esto es necesario para mostrar el mensaje de confirmación en algunos navegadores.
    }
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.idSucursal = parseInt(this.route.snapshot.params['id']);
    }

    this.negocioServicio.obtener(1).subscribe({
    next: (data) => {
      this.negocio = data;
    },
    error: (err) => {
      this.mostrarMensaje('Error al obtener la información del negocio', err);
    }
  });
  }

  registrarSucursal() {
    if (!this.negocio) {
      this.mostrarMensaje('No se ha cargado la información del negocio.', 'error');
      return;
    }

    const sucursal: ISucursal = {
      id: this.idSucursal || 0,
      oNegocio: this.negocio,
      codigo: Metodos.generarCodigo(),
      nombre: this.formSucursal.value.nombre?.trim() ?? '',
      direccion: this.formSucursal.value.direccion?.trim() ?? '',
      latitud: parseFloat(this.formSucursal.value.latitud ?? '0'),   
      longitud: parseFloat(this.formSucursal.value.longitud ?? '0'),
      ciudad: this.formSucursal.value.ciudad?.trim() ?? '',
      estado: this.formSucursal.value.estado ?? false
    };

    this.formSucursal.markAllAsTouched();
    console.log(sucursal);

    if (!this.formSucursal.valid) {
      this.mostrarMensaje('Formulario inválido.', 'error');
      console.log(this.formSucursal.valid);
      return;
    }

    this.sucursalServicio.registrar(sucursal).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          this.router.navigate(['/sucursal'], { skipLocationChange: true });
          this.mostrarMensaje('¡Sucursal registrada exitosamente!', 'success');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error 400:', err.error);
        if (err.error?.errors) {
          Object.entries(err.error.errors).forEach(([campo, errores]) => {
            console.log(`Error en ${campo}:`, errores);
          });
          this.mostrarMensaje('Error al registrar la sucursal', 'error');
        }
      }
    });
  }

  regresar() {
    this.router.navigate(['/sucursal']);
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
    const camposEditables = ['nombre', 'direccion', 'latitud', 'longitud', 'ciudad'];
    const camposVacios = camposEditables.some(
      (campo) => this.formSucursal.get(campo)?.value === ''
    );
    const camposConDatos = camposEditables.some(
      (campo) => this.formSucursal.get(campo)?.value !== ''
    );

    return camposConDatos && camposVacios ? false : true;
  }

  get nombreField(): FormControl<string> {
    return this.formSucursal.controls.nombre;
  }

  get direccionField(): FormControl<string> {
    return this.formSucursal.controls.direccion;
  }

  get ciudadField(): FormControl<string> {
    return this.formSucursal.controls.ciudad;
  }

  get latitudField(): FormControl<string> {
    return this.formSucursal.controls.latitud;
  }

  get longitudField(): FormControl<string> {
    return this.formSucursal.controls.longitud;
  }
}
