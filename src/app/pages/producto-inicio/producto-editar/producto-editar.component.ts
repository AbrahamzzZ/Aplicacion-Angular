import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ProductoService } from '../../../../services/producto.service';
import { Validaciones } from '../../../../utility/validaciones';
import { ActivatedRoute, Router } from '@angular/router';
import { IProducto } from '../../../models/producto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-producto-editar',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './producto-editar.component.html',
  styleUrl: './producto-editar.component.scss'
})
export class ProductoEditarComponent implements OnInit{
  private productoServicio = inject(ProductoService);
  private activatedRoute = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private formBuild = inject(FormBuilder);
  idProducto!: number;

  public formProducto = this.formBuild.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    descripcion: ['', Validators.required],
    categoria: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validaciones.soloLetras()]],
    paisOrigen: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validaciones.soloLetras()]],
    stock: [0, [Validators.required, Validaciones.stockValido()]],
    precioVenta: [0, [Validators.required, Validaciones.formatoPrecio()]],
    estado: [false]
  });

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idProducto = +params['id']; 
      if (this.idProducto) {
        this.cargarProducto();
      }
    });
  }

  cargarProducto(): void {
    this.productoServicio.obtener(this.idProducto).subscribe({
      next: (data) => {
        if (data) {
          this.formProducto.patchValue({
              nombre: data.nombre,
              descripcion: data.descripcion,
              categoria: data.categoria,
              paisOrigen: data.pais_Origen,
              stock: data.stock,
              precioVenta: data.precio_Venta,
              estado: data.estado
            });
          }
        },
        error: (err) => {
      console.error('Error al obtener cliente:', err);
      }
    });
  }

  editarProducto(): void{
    const producto: Partial<IProducto> = {
      id: this.idProducto,
      nombre: this.formProducto.value.nombre!,
      descripcion: this.formProducto.value.descripcion!,
      categoria: this.formProducto.value.categoria!,
      pais_Origen: this.formProducto.value.paisOrigen!,
      stock: this.formProducto.value.stock!,
      precio_Venta: this.formProducto.value.precioVenta!,
      estado: this.formProducto.value.estado
    };

    this.productoServicio.editar(producto).subscribe({
      next:(data)=>{
        if(data.isSuccess){
          this.router.navigate(['/producto']);
          this.mostrarMensaje('✔ Producto editado correctamente.');
        }
      }, 
      error:(err)=>{
        console.log(err);
        this.mostrarMensaje('❌ Error al editar la información el producto.');
      }
    });
  }

  regresar(){
    this.router.navigate(["/producto"]);
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Módulo Producto', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
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
