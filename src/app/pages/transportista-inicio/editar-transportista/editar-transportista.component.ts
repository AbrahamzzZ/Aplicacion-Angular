import { Component, inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Validaciones } from '../../../../utility/validaciones';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransportistaService } from '../../../../services/transportista.service';

@Component({
  selector: 'app-editar-transportista',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, MatCheckboxModule, ReactiveFormsModule, CommonModule, MatIcon, RouterLink],
  templateUrl: './editar-transportista.component.html',
  styleUrl: './editar-transportista.component.scss'
})
export class EditarTransportistaComponent {
  @Input('id') idTransportista!: number;
  private transportistaServicio = inject(TransportistaService);
  
  public readonly formBuild = inject(FormBuilder);
  
  imagenURL: string | null = null;
  formGroup = this.formBuild.nonNullable.group({
      nombres: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
      apellidos: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
      cedula: ['', [Validators.required, Validaciones.soloNumeros()]],
      telefono: ['', [Validators.required, Validaciones.soloNumeros()]],
      correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      estado: [false],
      imagen: [null, [Validaciones.imagenRequerida(), Validaciones.tamanoMaximo(2*1024*1024)]]
    });
  
    subirImagen(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
  
        // Guardar la imagen en el formulario
        this.imagenField.setValue(file);
        this.imagenField.markAsTouched();
  
        // Generar vista previa de la imagen
        const reader = new FileReader();
        reader.onload = () => {
          this.imagenURL = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  
    eliminarImagen(): void {
      this.imagenField.setValue(null);
      this.imagenField.markAsUntouched();
      this.imagenURL = null;
    }

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
  
  get imagenField(): FormControl<File | null> { 
    return this.formGroup.controls.imagen; 
  }
}
