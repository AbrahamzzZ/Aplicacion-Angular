import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Validaciones } from '../../../../utility/validaciones';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ITransportista } from '../../../models/transportista';
import { Metodos } from '../../../../utility/metodos';
import { TransportistaService } from '../../../../services/transportista.service';

@Component({
  selector: 'app-transportista',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, MatCheckboxModule, ReactiveFormsModule, CommonModule, MatIcon],
  templateUrl: './registro-transportista.component.html',
  styleUrl: './registro-transportista.component.scss'
})
export class RegistroTransportistaComponent implements OnInit{
  @Input('id') idProveedor!: number;
  private route = inject(ActivatedRoute);
  private transportistaServicio = inject(TransportistaService);
  private formBuilder = inject(FormBuilder);
  imagenURL: string | null = null;

  public formTransportista = this.formBuilder.nonNullable.group({
    codigo: [Metodos.generarCodigo()],
    nombres: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    apellidos: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    cedula: ['', [Validators.required, Validaciones.soloNumeros()]],
    telefono: ['', [Validators.required, Validaciones.soloNumeros()]],
    correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    estado: [false],
    imagen: [null, [Validaciones.imagenRequerida(), Validaciones.tamanoMaximo(2*1024*1024)]]
  });

  constructor(private router:Router) {
  }

  ngOnInit(): void {
    if(this.route.snapshot.params['id']){
      this.idProveedor= parseInt(this.route.snapshot.params['id']);
    }
  }

  /*registrarTransportista(){
      const transportista: ITransportista = {
      id: this.idProveedor || 0,
      codigo: Metodos.generarCodigo(),
      nombres: this.formTransportista.value.nombres?.trim() ?? '',
      apellidos: this.formTransportista.value.apellidos?.trim() ?? '',
      cedula: this.formTransportista.value.cedula?.trim() ?? '',
      telefono: this.formTransportista.value.telefono?.trim() ?? '',
      correo_Electronico: this.formTransportista.value.correoElectronico?.trim() ?? '',
      imagen: '', 
      imagenBase64: this.imagenURL,
      estado: this.formTransportista.value.estado ?? false,
      fecha_Registro: Metodos.getFechaCreacion()
    };
    
    if (!this.formTransportista.valid) {
      console.log('Formulario inválido:', this.formTransportista);
      return;
    }
    
    this.transportistaServicio.registrar(transportista).subscribe({
      next: (data) => {
        if (data.isSuccess) {
           this.router.navigate(['/transportista']);
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
  }*/

    registrarTransportista() {
      const transportista: ITransportista = {
        id: this.idProveedor || 0,
        codigo: Metodos.generarCodigo(),
        nombres: this.formTransportista.value.nombres?.trim() ?? '',
        apellidos: this.formTransportista.value.apellidos?.trim() ?? '',
        cedula: this.formTransportista.value.cedula?.trim() ?? '',
        telefono: this.formTransportista.value.telefono?.trim() ?? '',
        correo_Electronico: this.formTransportista.value.correoElectronico?.trim() ?? '',
        imagen: this.imagenField.value,
        imagenBase64: this.imagenURL,
        estado: this.formTransportista.value.estado ?? false,
        fecha_Registro: Metodos.getFechaCreacion()
      };
    
      if (!this.formTransportista.valid) {
        console.log('Formulario inválido:', this.formTransportista);
        return;
      }
    
      const formData = new FormData();
      formData.append('transportista', JSON.stringify(transportista));
      
      if (this.imagenField.value) {
        formData.append('imagen', this.imagenField.value);
      }
    
      this.transportistaServicio.registrar(formData).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.router.navigate(['/transportista']);
          } else {
            console.log('Error en la respuesta:', data);
          }
        },
        error: (err: HttpErrorResponse) => {
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
    this.router.navigate(["/transportista"])
  }

  subirImagen(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenURL = reader.result as string;
        this.imagenField.setValue(file);
        this.imagenField.markAsTouched();
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
    return this.formTransportista.controls.nombres;
  }

  get apellidosField(): FormControl<string> {
    return this.formTransportista.controls.apellidos;
  }

  get cedulaField(): FormControl<string> {
    return this.formTransportista.controls.cedula;
  }

  get telefonoField(): FormControl<string> {
    return this.formTransportista.controls.telefono;
  }

  get correoElectronicoField(): FormControl<string> {
    return this.formTransportista.controls.correoElectronico;
  }

  get imagenField(): FormControl<File | null> { 
    return this.formTransportista.controls.imagen; 
  }
}
