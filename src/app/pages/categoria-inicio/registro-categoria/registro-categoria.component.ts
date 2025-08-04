import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../../../services/categoria.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Metodos } from '../../../../utility/metodos';
import { Validaciones } from '../../../../utility/validaciones';
import { HttpErrorResponse } from '@angular/common/http';
import { ICategoria } from '../../../interfaces/categoria';
import { Observable } from 'rxjs';
import { CanComponentDeactive } from '../../../guards/formulario-incompleto.guard';

@Component({
  selector: 'app-registro-categoria',
  standalone: true,
  imports: [
    MatCardModule,
    MatInput,
    MatFormFieldModule,
    MatButton,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './registro-categoria.component.html',
  styleUrl: './registro-categoria.component.scss'
})
export class RegistroCategoriaComponent implements OnInit, CanComponentDeactive{
  @Input('id') idCategoria!: number;
  private route = inject(ActivatedRoute);
  private categoriaServicio = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);

  public formCategoria = this.formBuilder.nonNullable.group({
    codigo: [Metodos.generarCodigo()],
    nombre: [
      '',
      [Validators.required, Validaciones.soloLetras(), Validators.maxLength(70)]
    ],
    estado: [false]
  });

  @HostListener('window:beforeunload', ['$event'])
    onBeforeReload(e: BeforeUnloadEvent) {
      const camposEditables = ['nombreCompleto', 'clave', 'correoElectronico'];
      const camposConDatos = camposEditables.some(
        (campo) => this.formCategoria.get(campo)?.value !== ''
      );
  
    if (camposConDatos) {
      e.preventDefault();
      e.returnValue = ''; // Esto es necesario para mostrar el mensaje de confirmación en algunos navegadores.
    }
  }
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.idCategoria = parseInt(this.route.snapshot.params['id']);
    }
  }

  registrarCategoria() {
    const usuario: ICategoria = {
      idCategoria: this.idCategoria || 0,
      codigo: Metodos.generarCodigo(),
      nombreCategoria: this.formCategoria.value.nombre?.trim() ?? '',
      estado: this.formCategoria.value.estado ?? false,
      fechaCreacion: Metodos.getFechaCreacion()
    };

    this.formCategoria.markAllAsTouched();

    if (!this.formCategoria.valid) {
      this.mostrarMensaje('Formulatio inválido', 'error');
      return;
    }

    this.categoriaServicio.registrar(usuario).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          this.router.navigate(['/categoria'], { skipLocationChange: true });
          this.mostrarMensaje('¡Categoría registrada exitosamente!', 'success');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error 400:', err.error);
        if (err.error?.errors) {
          Object.entries(err.error.errors).forEach(([campo, errores]) => {
            console.log(`Error en ${campo}:`, errores);
          });
          this.mostrarMensaje('Error al registrar la Categoría', 'error');
        }
      }
    });
  }

  regresar() {
    this.router.navigate(['/categoria']);
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
    const camposEditables = ['nombre'];
    const camposVacios = camposEditables.some((campo) => this.formCategoria.get(campo)?.value === '');
    const camposConDatos = camposEditables.some(
      (campo) => this.formCategoria.get(campo)?.value !== ''
    );

    return camposConDatos && camposVacios ? false : true;
  }

  get nombreField(): FormControl<string> {
    return this.formCategoria.controls.nombre;
  }
}
