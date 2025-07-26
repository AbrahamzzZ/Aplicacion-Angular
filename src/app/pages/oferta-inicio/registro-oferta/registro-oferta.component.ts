import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
 import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
 import { MatButton } from '@angular/material/button';
 import { MatCardModule } from '@angular/material/card';
 import { MatCheckboxModule } from '@angular/material/checkbox';
 import { MatFormFieldModule } from '@angular/material/form-field';
 import { MatInput } from '@angular/material/input';
 import { ActivatedRoute, Router } from '@angular/router';
 import { OfertaService } from '../../../../services/oferta.service';
 import { MatSnackBar } from '@angular/material/snack-bar';
 import { Metodos } from '../../../../utility/metodos';
 import { Validaciones } from '../../../../utility/validaciones';
 import { IOferta } from '../../../interfaces/oferta';
 import { HttpErrorResponse } from '@angular/common/http';
 import { Observable } from 'rxjs';
 import { MatSelectChange, MatSelectModule } from '@angular/material/select';
 import { MatDatepickerModule } from '@angular/material/datepicker';
 import { ProductoService } from '../../../../services/producto.service';
 import { IProducto } from '../../../interfaces/producto';
 import { MatNativeDateModule } from '@angular/material/core';
import { CanComponentDeactive } from '../../../guards/formulario-incompleto.guard';

 @Component({
  selector: 'app-registro-oferta',
  standalone: true,
  imports: [ MatCardModule,
      MatInput,
      MatFormFieldModule,
      MatButton,
      MatCheckboxModule,
      MatSelectModule,
      MatDatepickerModule,
      ReactiveFormsModule, 
      MatNativeDateModule],
  templateUrl: './registro-oferta.component.html',
  styleUrl: './registro-oferta.component.scss'
})

export class RegistroOfertaComponent implements OnInit, CanComponentDeactive{
  @Input('id') idOferta!: number;
  private route = inject(ActivatedRoute);
  private ofertaServicio = inject(OfertaService);
  private productoServicio = inject(ProductoService);
  public productos:IProducto [] = [];
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);

  public formOferta = this.formBuilder.nonNullable.group({
    codigo: [Metodos.generarCodigo()],
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ]
    ],
    producto: [0, [Validators.required, Validaciones.productoRequerido()]],
    descripcion: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(250),
      ]
    ],
    fechaInicio: [new Date(), [Validators.required]],
    fechaFin: [new Date(), [Validators.required, Validaciones.fechaFinValida(new Date())]],
    descuento: [0, [Validators.required, Validators.max(100), Validators.min(1)]],
    estado: [false]
  });

  @HostListener('window:beforeunload', ['$event'])
  onBeforeReload(e: BeforeUnloadEvent) {
    const camposEditables = ['nombre', 'descripcion'];
    const camposConDatos = camposEditables.some(
      (campo) => this.formOferta.get(campo)?.value !== ''
    );
  
    if (camposConDatos) {
      e.preventDefault();
      e.returnValue = '';  // Esto es necesario para mostrar el mensaje de confirmación en algunos navegadores.
    }
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.idOferta = parseInt(this.route.snapshot.params['id']);
    }

    this.productoServicio.lista().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al obtener los productos:', err);
      }
    });
  }

  registrarOferta() {
    const productoId = this.formOferta.value.producto;
    const productoSeleccionado = this.productos.find(p => p.id === productoId)?? {} as IProducto;

    const oferta: IOferta = {
      id: this.idOferta || 0,
      codigo: Metodos.generarCodigo(),
      nombre: this.formOferta.value.nombre?.trim() ?? '',
      oProducto: productoSeleccionado,
      descripcion: this.formOferta.value.descripcion?.trim() ?? '',
      fecha_Inicio: this.formOferta.value.fechaInicio ? new Date(this.formOferta.value.fechaInicio).toISOString() : '',
      fecha_Fin: this.formOferta.value.fechaFin ? new Date(this.formOferta.value.fechaFin).toISOString() : '',
      descuento: this.formOferta.value.descuento ?? 0,
      estado: this.formOferta.value.estado ?? false,
      fecha_Creacion: Metodos.getFechaCreacion()
    };

    this.formOferta.markAllAsTouched();

    if (!this.formOferta.valid) {
      this.mostrarMensaje('Formulario inválido.', 'error');
      return;
    }

    this.ofertaServicio.registrar(oferta).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          this.router.navigate(['/oferta'], { skipLocationChange: true });
          this.mostrarMensaje('¡Oferta registrado exitosamente!', 'success');
        }
        console.log(data);
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error 400:', err.error);
        this.mostrarMensaje('Error al registrar la Oferta', 'error');
      }
    });
  }

  regresar() {
    this.router.navigate(['/oferta']);
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
      'descripcion'
    ];
    const camposVacios = camposEditables.some(
      (campo) => this.formOferta.get(campo)?.value === ''
    );
    const camposConDatos = camposEditables.some(
      (campo) => this.formOferta.get(campo)?.value !== ''
    );

    return camposConDatos && camposVacios ? false : true;
  }

  productoSeleccionado(event: MatSelectChange) {
    const productoId = event.value;
    this.formOferta.controls.producto.setValue(productoId);
  }

  get nombreField(): FormControl<string> {
    return this.formOferta.controls.nombre;
  }

  get descripcionField(): FormControl<string> {
    return this.formOferta.controls.descripcion;
  }

  get productoSeleccionadoField(): FormControl<number> {
    return this.formOferta.controls.producto;
  }

  get fechaInicioField(): FormControl<Date>{
    return this.formOferta.controls.fechaInicio;
  }

  get fechaFinField(): FormControl<Date>{
    return this.formOferta.controls.fechaFin;
  }

  get descuentoField(): FormControl<number> {
    return this.formOferta.controls.descuento;
  }
}