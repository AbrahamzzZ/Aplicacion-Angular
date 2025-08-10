import { Component, HostListener, inject, OnInit } from '@angular/core';
import { SucursalService } from '../../../../services/sucursal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISucursal } from '../../../interfaces/sucursal';
import { Metodos } from '../../../../utility/metodos';
import { Validaciones } from '../../../../utility/validaciones';
import { MatCardModule } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-editar-sucursal',
  standalone: true,
  imports: [
    MatCardModule,
    MatInput,
    MatFormFieldModule,
    MatButton,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './editar-sucursal.component.html',
  styleUrl: './editar-sucursal.component.scss'
})
export class EditarSucursalComponent implements OnInit{

  private sucursalServicio = inject(SucursalService);
  private activatedRoute = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);
  public idSucursal!: number;

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
    this.activatedRoute.params.subscribe((params) => {
      this.idSucursal = +params['id'];
      if (this.idSucursal) {
        this.cargarSucursal();
      }
    });
  }

  cargarSucursal(): void {
    this.sucursalServicio.obtener(this.idSucursal).subscribe({
      next: (data) => {
        if (data) {
          this.formSucursal.patchValue({
            nombre: data.nombre_Sucursal,
            direccion: data.direccion_Sucursal,
            latitud: data.latitud.toString(),
            longitud: data.longitud.toString(),
            ciudad: data.ciudad_Sucursal,
            estado: data.estado
          });
        }
      },
      error: (err) => {
        this.mostrarMensaje('Error al cargar la infomación de la sucursal.');
        console.error(err);
      }
    });
  }

  editarSucursal(): void {
    const sucursal: Partial<ISucursal> = {
      id_Sucursal: this.idSucursal,
      nombre_Sucursal: this.formSucursal.value.nombre!,
      direccion_Sucursal: this.formSucursal.value.direccion!,
      latitud: parseFloat(this.formSucursal.value.latitud ?? '0'),
      longitud: parseFloat(this.formSucursal.value.longitud ?? '0'),
      ciudad_Sucursal: this.formSucursal.value.ciudad!,
      estado: this.formSucursal.value.estado
    };

    this.formSucursal.markAllAsTouched();

    if (!this.formSucursal.valid) {
      this.mostrarMensaje('Formulario inválido.', 'error');
      return;
    }

    this.sucursalServicio.editar(sucursal).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          this.router.navigate(['/sucursal']);
          this.mostrarMensaje('¡Sucursal editada exitosamente!', 'success');
        }
      },
      error: (err) => {
        console.error(err);
        this.mostrarMensaje('Error al editar la sucursal', 'error');
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
