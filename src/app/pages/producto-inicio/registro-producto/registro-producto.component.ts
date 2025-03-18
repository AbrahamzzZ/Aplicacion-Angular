import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, ReactiveFormsModule],
  templateUrl: './registro-producto.component.html',
  styleUrl: './registro-producto.component.scss'
})
export class ProductoComponent {
  private readonly formBuilder = inject(FormBuilder);
  formGroup = this.formBuilder.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    categoria: ['', Validators.required],
    paisOrigen: ['', Validators.required],
    stock: ['', Validators.required],
    precioVenta: ['', Validators.required]
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
