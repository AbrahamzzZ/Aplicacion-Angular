import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { CanComponentDeactive } from '../../../guards/formulario-incompleto.guard';
import { CategoriaService } from '../../../../services/categoria.service';
import { ICategoria } from '../../../models/categoria';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-producto',
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
  templateUrl: './registro-producto.component.html',
  styleUrl: './registro-producto.component.scss'
})
export class RegistroProductoComponent implements OnInit, CanComponentDeactive {
  @Input('id') idProducto!: number;
  private route = inject(ActivatedRoute);
  private productoServicio = inject(ProductoService);
  private categoriaServicio = inject(CategoriaService);
  public categorias:ICategoria [] = [];
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);

  public formProducto = this.formBuilder.nonNullable.group({
    codigo: [Metodos.generarCodigo()],
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
    if (this.route.snapshot.params['id']) {
      this.idProducto = parseInt(this.route.snapshot.params['id']);
    }

    this.categoriaServicio.lista().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener las categorías:', err);
      }
    });
  }

  registrarProducto() {
    const categoriaId = this.formProducto.value.categoria;
    const categoriaSeleccionada = this.categorias.find(p => p.id === categoriaId)?? {} as ICategoria;

    const producto: IProducto = {
      id: this.idProducto || 0,
      codigo: Metodos.generarCodigo(),
      nombre: this.formProducto.value.nombre?.trim() ?? '',
      descripcion: this.formProducto.value.descripcion?.trim() ?? '',
      oCategoria: categoriaSeleccionada,
      pais_Origen: this.formProducto.value.paisOrigen?.trim() ?? '',
      estado: this.formProducto.value.estado ?? false
    } as IProducto;

    this.formProducto.markAllAsTouched();

    if (!this.formProducto.valid) {
      this.mostrarMensaje('Formulario inválido.', 'error');
      return;
    }

    this.productoServicio.registrar(producto).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          this.router.navigate(['/producto'], { skipLocationChange: true });
          this.mostrarMensaje('¡Producto registrado exitosamente!', 'success');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error 400:', err.error);
        if (err.error?.errors) {
          Object.entries(err.error.errors).forEach(([campo, errores]) => {
            console.log(`Error en ${campo}:`, errores);
          });
          this.mostrarMensaje('Error al registrar el Producto', 'error');
        }
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

  canDeactive(): boolean | Observable<boolean> {
    const camposEditables = [
      'nombre',
      'descripcion',
      'paisOrigen'
    ];
    const camposVacios = camposEditables.some(
      (campo) => this.formProducto.get(campo)?.value === ''
    );
    const camposConDatos = camposEditables.some(
      (campo) => this.formProducto.get(campo)?.value !== ''
    );

    return camposConDatos && camposVacios ? false : true;
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
