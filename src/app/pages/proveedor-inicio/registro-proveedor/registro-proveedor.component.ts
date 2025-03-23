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
import { IProveedor } from '../../../models/proveedor';
import { Metodos } from '../../../../utility/metodos';
import { ProveedorService } from '../../../../services/proveedor.service';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './registro-proveedor.component.html',
  styleUrl: './registro-proveedor.component.scss'
})
export class ProveedorComponent implements OnInit{
  @Input('id') idProveedor!: number;
  private route = inject(ActivatedRoute);
  private proveedorServicio = inject(ProveedorService);
  private formBuilder = inject(FormBuilder);

  public formProveedor = this.formBuilder.nonNullable.group({
    codigo: [Metodos.generarCodigo()],
    nombres: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    apellidos: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    cedula: ['', [Validators.required, Validaciones.soloNumeros()]],
    telefono: ['', [Validators.required, Validaciones.soloNumeros()]],
    correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    estado: [false]
  });

  constructor(private router:Router) {
  }

  ngOnInit(): void {
    if(this.route.snapshot.params['id']){
      this.idProveedor= parseInt(this.route.snapshot.params['id']);
    }
  }

  registrarProveedor(){
    const proveedor: IProveedor = {
      id: this.idProveedor || 0,
      codigo: Metodos.generarCodigo(),
      nombres: this.formProveedor.value.nombres?.trim() ?? '',
      apellidos: this.formProveedor.value.apellidos?.trim() ?? '',
      cedula: this.formProveedor.value.cedula?.trim() ?? '',
      telefono: this.formProveedor.value.telefono?.trim() ?? '',
      correo_Electronico: this.formProveedor.value.correoElectronico?.trim() ?? '',
      estado: this.formProveedor.value.estado ?? false,
      fecha_Registro: Metodos.getFechaCreacion()
    };
    
    if (!this.formProveedor.valid) {
      console.log('Formulario inválido:', this.formProveedor);
      return;
    }
    
    this.proveedorServicio.registrar(proveedor).subscribe({
      next: (data) => {
        if (data.isSuccess) {
           this.router.navigate(['/proveedor']);
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
    this.router.navigate(["/proveedor"])
  }

  get nombresField(): FormControl<string> {
    return this.formProveedor.controls.nombres;
  }

  get apellidosField(): FormControl<string> {
    return this.formProveedor.controls.apellidos;
  }

  get cedulaField(): FormControl<string> {
    return this.formProveedor.controls.cedula;
  }

  get telefonoField(): FormControl<string> {
    return this.formProveedor.controls.telefono;
  }

  get correoElectronicoField(): FormControl<string> {
    return this.formProveedor.controls.correoElectronico;
  }
}
