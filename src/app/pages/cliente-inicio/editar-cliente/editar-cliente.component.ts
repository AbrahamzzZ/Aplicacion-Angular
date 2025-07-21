import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validaciones } from '../../../../utility/validaciones';
import { MatCardModule } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClienteService } from '../../../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICliente } from '../../../models/cliente';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-cliente',
  standalone: true,
  imports: [
    MatCardModule,
    MatInput,
    MatFormFieldModule,
    MatButton,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './editar-cliente.component.html',
  styleUrl: './editar-cliente.component.scss'
})
export class EditarClienteComponent implements OnInit {
  private clienteServicio = inject(ClienteService);
  private activatedRoute = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);
  idCliente!: number;

  public formCliente = this.formBuilder.nonNullable.group({
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
    correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]]
  });

  @HostListener('window:beforeunload', ['$event'])
  onBeforeReload(e: BeforeUnloadEvent) {
    const camposEditables = ['nombres', 'apellidos', 'cedula', 'telefono', 'correoElectronico'];
    const camposConDatos = camposEditables.some(
      (campo) => this.formCliente.get(campo)?.value !== ''
    );
  
    if (camposConDatos) {
      e.preventDefault();
      e.returnValue = '';  // Esto es necesario para mostrar el mensaje de confirmación en algunos navegadores.
    }
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.idCliente = +params['id'];
      if (this.idCliente) {
        this.cargarCliente();
      }
    });
  }

  cargarCliente(): void {
    this.clienteServicio.obtener(this.idCliente).subscribe({
      next: (data) => {
        if (data) {
          this.formCliente.patchValue({
            nombres: data.nombres,
            apellidos: data.apellidos,
            cedula: data.cedula,
            telefono: data.telefono,
            correoElectronico: data.correo_Electronico
          });
        }
      },
      error: (err) => {
        this.mostrarMensaje('Error al cargar la infomación del cliente.');
        console.error(err);
      }
    });
  }

  editarCliente(): void {
    const cliente: Partial<ICliente> = {
      id: this.idCliente,
      nombres: this.formCliente.value.nombres!,
      apellidos: this.formCliente.value.apellidos!,
      cedula: this.formCliente.value.cedula!,
      telefono: this.formCliente.value.telefono!,
      correo_Electronico: this.formCliente.value.correoElectronico!
    };

    this.formCliente.markAllAsTouched();

    if (!this.formCliente.valid) {
      this.mostrarMensaje('Formulario inválido.', 'error');
      return;
    }

    this.clienteServicio.editar(cliente).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          this.router.navigate(['/cliente']);
          this.mostrarMensaje('¡Cliente editado exitosamente!', 'success');
        }
      },
      error: (err) => {
        console.error(err);
        this.mostrarMensaje('Error al editar el Cliente', 'error');
      }
    });
  }

  regresar() {
    this.router.navigate(['/cliente']);
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
    return this.formCliente.controls.nombres;
  }

  get apellidosField(): FormControl<string> {
    return this.formCliente.controls.apellidos;
  }

  get cedulaField(): FormControl<string> {
    return this.formCliente.controls.cedula;
  }

  get telefonoField(): FormControl<string> {
    return this.formCliente.controls.telefono;
  }

  get correoElectronicoField(): FormControl<string> {
    return this.formCliente.controls.correoElectronico;
  }
}
