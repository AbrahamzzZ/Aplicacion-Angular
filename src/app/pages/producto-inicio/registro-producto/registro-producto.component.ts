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
  selector: 'app-producto',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, MatCheckboxModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro-producto.component.html',
  styleUrl: './registro-producto.component.scss'
})
export class ProductoComponent {
  private readonly formBuilder = inject(FormBuilder);
  formGroup = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    descripcion: ['', Validators.required],
    categoria: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validaciones.soloLetras()]],
    paisOrigen: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validaciones.soloLetras()]],
    stock: ['', [Validators.required, Validaciones.stockValido()]],
    precioVenta: ['', [Validators.required, Validaciones.formatoPrecio()]],
    estado: [false]
  });

  get nombreField(): FormControl<string> {
    return this.formGroup.controls.nombre;
  }

  get descripcionField(): FormControl<string> {
    return this.formGroup.controls.descripcion;
  }

  get categoriaField(): FormControl<string> {
    return this.formGroup.controls.categoria;
  }

  get paisOrigenField(): FormControl<string> {
    return this.formGroup.controls.paisOrigen;
  }

  get stockField(): FormControl<string> {
    return this.formGroup.controls.stock;
  }

  get precioVentaField(): FormControl<string> {
    return this.formGroup.controls.precioVenta;
  }
}
