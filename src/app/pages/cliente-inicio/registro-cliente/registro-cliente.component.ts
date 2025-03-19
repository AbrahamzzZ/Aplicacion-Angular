import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Validaciones } from '../../../../utility/validaciones';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [ MatCardModule, MatInput, MatFormFieldModule, MatButton, MatCheckboxModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro-cliente.component.html',
  styleUrl: './registro-cliente.component.scss'
})
export class RegistroClienteComponent {
  private readonly formBuilder = inject(FormBuilder);
  formGroup = this.formBuilder.nonNullable.group({
    nombres: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    apellidos: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    cedula: ['', [Validators.required, Validaciones.soloNumeros()]],
    telefono: ['', [Validators.required, Validaciones.soloNumeros()]],
    correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    estado: [false]
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
