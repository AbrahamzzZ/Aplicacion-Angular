import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Validaciones } from '../../../../utility/validaciones';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransportistaService } from '../../../../services/transportista.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-transportista',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, MatCheckboxModule, ReactiveFormsModule, CommonModule, MatIcon],
  templateUrl: './editar-transportista.component.html',
  styleUrl: './editar-transportista.component.scss'
})
export class EditarTransportistaComponent implements OnInit{

  private activatedRoute = inject(ActivatedRoute);
  private transportistaServicio = inject(TransportistaService);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);
  idTransportista!: number;
  public imagenURL: string | null = null;

  public formTransportista = this.formBuilder.nonNullable.group({
    nombres: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    apellidos: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    cedula: ['', [Validators.required, Validaciones.soloNumeros()]],
    telefono: ['', [Validators.required, Validaciones.soloNumeros()]],
    correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    imageBase64: [''],
    imagen: [''],
    estado: [false]
  });
    
  constructor(private router: Router) {}
    
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idTransportista = +params['id']; 
      if (this.idTransportista) {
        this.cargarTransportista();
      }
    });
  }
 
  cargarTransportista(): void {
    this.transportistaServicio.obtener(this.idTransportista).subscribe({
      next: (data) => {
        if (data) {
          this.formTransportista.patchValue({
              nombres: data.nombres,
              apellidos: data.apellidos,
              cedula: data.cedula,
              telefono: data.telefono,
              correoElectronico: data.correo_Electronico,
              estado: data.estado
            });
            
            if (data.imagenBase64 && typeof data.imagenBase64 === 'string') {
              this.imagenURL = `data:image/png;base64,${data.imagenBase64}`;
            } else {
              this.imagenURL = 'assets/default-user.png'; // Imagen por defecto
            }
          }
        },
        error: (err) => {
      console.error('Error al obtener cliente:', err);
      }
    });
  } 

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Módulo Transportista', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
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
        this.imagenURL = reader.result as string; // Vista previa de la imagen
        
        this.formTransportista.controls.imagen.setValue(this.imagenURL?.split(',')[1]); // Guardar solo la parte Base64
        this.imagenField.markAsTouched();
        console.log(this.imagenURL);
      };

      reader.readAsDataURL(file); // Convierte la imagen a Base64
    }
  }
  
  eliminarImagen(): void {
    this.imagenField.setValue('');
    this.imagenField.markAsUntouched();
    this.imagenURL = '';
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
  
  get imagenField(): FormControl<string> { 
    return this.formTransportista.controls.imagen; 
  }
}
