import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Validaciones } from '../../../../utility/validaciones';
import { ProveedorService } from '../../../../services/proveedor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IProveedor } from '../../../interfaces/proveedor';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-proveedor',
  standalone: true,
  imports: [
    MatCardModule,
    MatInput,
    MatFormFieldModule,
    MatButton,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './editar-proveedor.component.html',
  styleUrl: './editar-proveedor.component.scss'
})
export class EditarProveedorComponent implements OnInit {
  private proveedorServicio = inject(ProveedorService);
  private activatedRoute = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);
  idProveedor!: number;

  public formProveedor = this.formBuilder.nonNullable.group({
    nombres: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        Validaciones.soloLetras()
      ]
    ],
    apellidos: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        Validaciones.soloLetras()
      ]
    ],
    cedula: ['', [Validators.required, Validaciones.soloNumeros()]],
    telefono: ['', [Validators.required, Validaciones.soloNumeros()]],
    correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    estado: [false]
  });

  @HostListener('window:beforeunload', ['$event'])
  onBeforeReload(e: BeforeUnloadEvent) {
    const camposEditables = ['nombres', 'apellidos', 'cedula', 'telefono', 'correoElectronico'];
    const camposConDatos = camposEditables.some(
      (campo) => this.formProveedor.get(campo)?.value !== ''
    );
  
    if (camposConDatos) {
      e.preventDefault();
      e.returnValue = '';  // Esto es necesario para mostrar el mensaje de confirmación en algunos navegadores.
    }
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.idProveedor = +params['id'];
      if (this.idProveedor) {
        this.cargarProvedor();
      }
    });
  }

  cargarProvedor(): void {
    this.proveedorServicio.obtener(this.idProveedor).subscribe({
      next: (data) => {
        if (data) {
          this.formProveedor.patchValue({
            nombres: data.nombres,
            apellidos: data.apellidos,
            cedula: data.cedula,
            telefono: data.telefono,
            correoElectronico: data.correo_Electronico,
            estado: data.estado
          });
        }
      },
      error: (err) => {
        this.mostrarMensaje('Error al cargar la infomación del proveedor.');
        console.error(err);
      }
    });
  }

  editarProveedor(): void {
    const proveedor: Partial<IProveedor> = {
      id_Proveedor: this.idProveedor,
      nombres: this.formProveedor.value.nombres!,
      apellidos: this.formProveedor.value.apellidos!,
      cedula: this.formProveedor.value.cedula!,
      telefono: this.formProveedor.value.telefono!,
      correo_Electronico: this.formProveedor.value.correoElectronico!,
      estado: this.formProveedor.value.estado
    };

    this.formProveedor.markAllAsTouched();

    if (!this.formProveedor.valid) {
      this.mostrarMensaje('Formulario inválido.', 'error');
      return;
    }

    this.proveedorServicio.editar(proveedor).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          this.router.navigate(['/proveedor']);
          this.mostrarMensaje('¡Proveedor editado exitosamente!', 'success');
        }
      },
      error: (err) => {
        console.error(err);
        this.mostrarMensaje('Error al editar el Proveedor', 'error');
      }
    });
  }

  regresar() {
    this.router.navigate(['/proveedor']);
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


  get nombresField(): FormControl<string> {
    return this.formProveedor.controls.nombres;
  }

  get apellidosField(): FormControl<string> {
    return this.formProveedor.controls.apellidos;
  }

  get cedulaField(): FormControl<string> {
    return this.formProveedor.controls.cedula;
  }

  get telefonoField(): FormControl<string> {
    return this.formProveedor.controls.telefono;
  }

  get correoElectronicoField(): FormControl<string> {
    return this.formProveedor.controls.correoElectronico;
  }
}
