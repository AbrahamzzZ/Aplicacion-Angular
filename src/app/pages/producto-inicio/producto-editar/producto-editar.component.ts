import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
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
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CategoriaService } from '../../../../services/categoria.service';
import { ICategoria } from '../../../models/categoria';

@Component({
  selector: 'app-producto-editar',
  standalone: true,
  imports: [
    MatCardModule,
    MatInput,
    MatFormFieldModule,
    MatButton,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './producto-editar.component.html',
  styleUrl: './producto-editar.component.scss'
})
export class ProductoEditarComponent implements OnInit {
  private productoServicio = inject(ProductoService);
  private categoriaServicio = inject(CategoriaService);
  public categorias:ICategoria [] = [];
  private activatedRoute = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private formBuild = inject(FormBuilder);
  idProducto!: number;

  public formProducto = this.formBuild.nonNullable.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        Validaciones.soloLetras()
      ]
    ],
    descripcion: ['', [Validators.required, Validators.maxLength(50)]],
    categoria: [0, [Validators.required, Validaciones.categoriaRequerida()]],
    paisOrigen: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validaciones.soloLetras()
      ]
    ],
    estado: [false]
  });

    @HostListener('window:beforeunload', ['$event'])
    onBeforeReload(e: BeforeUnloadEvent) {
      const camposEditables = ['nombre',
      'descripcion',
      'categoria',
      'paisOrigen'];
      const camposConDatos = camposEditables.some(
        (campo) => this.formProducto.get(campo)?.value !== ''
      );
    
      if (camposConDatos) {
        e.preventDefault();
        e.returnValue = '';  // Esto es necesario para mostrar el mensaje de confirmación en algunos navegadores.
      }
    }  

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.idProducto = +params['id'];
      if (this.idProducto) {
        this.cargarCategorias();
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
            categoria: data.oCategoria.id,
            paisOrigen: data.pais_Origen,
            estado: data.estado
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener producto:', err);
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaServicio.lista().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.mostrarMensaje('❌ Error al cargar las categorías.');
      }
    });
  }

  editarProducto(): void {
    const categoriaId = this.formProducto.value.categoria;
    const categoriaSeleccionada = this.categorias.find(p => p.id === categoriaId)?? {} as ICategoria;

    const producto: Partial<IProducto> = {
      id: this.idProducto,
      nombre: this.formProducto.value.nombre!,
      descripcion: this.formProducto.value.descripcion!,
      oCategoria: categoriaSeleccionada!,
      pais_Origen: this.formProducto.value.paisOrigen!,
      estado: this.formProducto.value.estado
    };

    this.formProducto.markAllAsTouched();

    if (!this.formProducto.valid) {
      this.mostrarMensaje('Formulario inválido.', 'error');
      return;
    }

    this.productoServicio.editar(producto).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          this.router.navigate(['/producto']);
          this.mostrarMensaje('¡Producto editado exitosamente!', 'success');
        }
      },
      error: (err) => {
        console.log(err);
        this.mostrarMensaje('Error al editar el producto', 'error');
      }
    });
  }

  regresar() {
    this.router.navigate(['/producto']);
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

  categoriaSeleccionada(event: MatSelectChange) {
    const categoriaId = event.value;
    this.formProducto.controls.categoria.setValue(categoriaId);
  }

  get nombreField(): FormControl<string> {
    return this.formProducto.controls.nombre;
  }

  get descripcionField(): FormControl<string> {
    return this.formProducto.controls.descripcion;
  }

  get categoriaSeleccionadaField(): FormControl<number> {
    return this.formProducto.controls.categoria;
  }

  get paisOrigenField(): FormControl<string> {
    return this.formProducto.controls.paisOrigen;
  }
}
