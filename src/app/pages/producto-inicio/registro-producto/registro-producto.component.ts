import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Validaciones } from '../../../../utility/validaciones';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IProducto } from '../../../models/producto';
import { Metodos } from '../../../../utility/metodos';
import { ProductoService } from '../../../../services/producto.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './registro-producto.component.html',
  styleUrl: './registro-producto.component.scss'
})
export class ProductoComponent implements OnInit{
  @Input('id') idProducto!: number;
  private route = inject(ActivatedRoute);
  private productoServicio = inject(ProductoService);
  private formBuilder = inject(FormBuilder);
  
  public formProducto = this.formBuilder.nonNullable.group({
    codigo: [Metodos.generarCodigo()],
    nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    descripcion: ['', Validators.required],
    categoria: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validaciones.soloLetras()]],
    paisOrigen: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validaciones.soloLetras()]],
    stock: [0, [Validators.required, Validaciones.stockValido()]],
    precioVenta: [0.00, [Validators.required, Validaciones.formatoPrecio()]],
    estado: [false],

  });

  constructor(private router:Router) {
  }

  ngOnInit(): void {
    if(this.route.snapshot.params['id']){
      this.idProducto = parseInt(this.route.snapshot.params['id']);
    }
  }

  registrarProducto(){
    const producto: IProducto = {
      id: this.idProducto || 0,
      codigo: Metodos.generarCodigo(),
      nombre: this.formProducto.value.nombre?.trim() ?? '',
      descripcion: this.formProducto.value.descripcion?.trim() ?? '',
      categoria: this.formProducto.value.categoria?.trim() ?? '',
      pais_Origen: this.formProducto.value.paisOrigen?.trim() ?? '',
      stock: this.formProducto.value.stock ?? 0,
      precio_Venta: this.formProducto.value.precioVenta ?? 0,
      estado: this.formProducto.value.estado ?? false
    };
    
    if (!this.formProducto.valid) {
      console.log('Formulario inválido:', this.formProducto);
      return;
    }
    
    this.productoServicio.registrar(producto).subscribe({
      next: (data) => {
        if (data.isSuccess) {
           this.router.navigate(['/producto']);
        } else {
          console.log('Error en la respuesta:', data);
        }
      },error: (err: HttpErrorResponse) => {
        console.log('Error 400:', err.error);
        if (err.error?.errors) {
          Object.entries(err.error.errors).forEach(([campo, errores]) => {
            console.log(`Error en ${campo}:`, errores);
          });
        }
      }
    });
  }

  regresar(){
    this.router.navigate(["/producto"])
  }

  get nombreField(): FormControl<string> {
    return this.formProducto.controls.nombre;
  }

  get descripcionField(): FormControl<string> {
    return this.formProducto.controls.descripcion;
  }

  get categoriaField(): FormControl<string> {
    return this.formProducto.controls.categoria;
  }

  get paisOrigenField(): FormControl<string> {
    return this.formProducto.controls.paisOrigen;
  }

  get stockField(): FormControl<number> {
    return this.formProducto.controls.stock;
  }

  get precioVentaField(): FormControl<number> {
    return this.formProducto.controls.precioVenta;
  }
}
