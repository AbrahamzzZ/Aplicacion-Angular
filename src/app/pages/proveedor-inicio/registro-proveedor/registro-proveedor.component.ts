import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, ReactiveFormsModule],
  templateUrl: './registro-proveedor.component.html',
  styleUrl: './registro-proveedor.component.scss'
})
export class ProveedorComponent {
  private readonly formBuilder = inject(FormBuilder);
  formGroup = this.formBuilder.nonNullable.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    cedula: ['', Validators.required],
    telefono: ['', Validators.required],
    correoElectronico: ['', Validators.required, Validators.email]
  });

  get nombresField(): FormControl<string> {
    return this.formGroup.controls.nombres;
  }

  get apellidosField(): FormControl<string> {
    return this.formGroup.controls.apellidos;
  }

  get cedulaField(): FormControl<string> {
    return this.formGroup.controls.cedula;
  }

  get telefonoField(): FormControl<string> {
    return this.formGroup.controls.telefono;
  }

  get correoElectronicoField(): FormControl<string> {
    return this.formGroup.controls.correoElectronico;
  }
}
