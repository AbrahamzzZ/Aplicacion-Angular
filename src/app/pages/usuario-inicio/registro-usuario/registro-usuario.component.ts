import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, ReactiveFormsModule],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.scss'
})
export class UsuarioComponent {
private readonly formBuilder = inject(FormBuilder);
  formGroup = this.formBuilder.nonNullable.group({
    nombreCompleto: ['', Validators.required],
    clave: ['', Validators.required],
    correoElectronico: ['', Validators.required, Validators.email]
  });

  get nombreCompletoField(): FormControl<string> {
    return this.formGroup.controls.nombreCompleto;
  }

  get claveField(): FormControl<string> {
    return this.formGroup.controls.clave;
  }

  get correoElectronicoField(): FormControl<string> {
    return this.formGroup.controls.correoElectronico;
  }
}
