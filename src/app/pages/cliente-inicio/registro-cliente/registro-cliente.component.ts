import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Validaciones } from '../../../../utility/validaciones';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { ICliente } from '../../../models/cliente';
import { Metodos } from '../../../../utility/metodos';
import { HttpErrorResponse } from '@angular/common/http';
import { ClienteService } from '../../../../services/cliente.service';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [ MatCardModule, MatInput, MatFormFieldModule, MatButton, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './registro-cliente.component.html',
  styleUrl: './registro-cliente.component.scss'
})
export class RegistroClienteComponent implements OnInit{
  @Input('id') idCliente!: number;
  private route = inject(ActivatedRoute);
  private clienteServicio = inject(ClienteService);
  private formBuilder = inject(FormBuilder);

  public formCliente = this.formBuilder.nonNullable.group({
    codigo: [Metodos.generarCodigo()],
    nombres: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    apellidos: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    cedula: ['', [Validators.required, Validaciones.soloNumeros()]],
    telefono: ['', [Validators.required, Validaciones.soloNumeros()]],
    correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
  });

  constructor(private router:Router) {
  }

  ngOnInit(): void {
    if(this.route.snapshot.params['id']){
      this.idCliente = parseInt(this.route.snapshot.params['id']);
    }
  }

  registrarCliente(){
    const cliente: ICliente = {
      id: this.idCliente || 0,
      codigo: Metodos.generarCodigo(),
      nombres: this.formCliente.value.nombres?.trim() ?? '',
      apellidos: this.formCliente.value.apellidos?.trim() ?? '',
      cedula: this.formCliente.value.cedula?.trim() ?? '',
      telefono: this.formCliente.value.telefono?.trim() ?? '',
      correo_Electronico: this.formCliente.value.correoElectronico?.trim() ?? '',
      fecha_Registro: Metodos.getFechaCreacion()
    };
    
    if (!this.formCliente.valid) {
      console.log('Formulario inválido:', this.formCliente);
      return;
    }
    
    this.clienteServicio.registrar(cliente).subscribe({
      next: (data) => {
        if (data.isSuccess) {
           this.router.navigate(['/cliente']);
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
    this.router.navigate(["/cliente"])
  }

  get nombresField(): FormControl<string> {
		return this.formCliente.controls.nombres;
	}

	get apellidosField(): FormControl<string> {
		return this.formCliente.controls.apellidos;
	}

	get cedulaField(): FormControl<string> {
		return this.formCliente.controls.cedula;
	}

	get telefonoField(): FormControl<string> {
		return this.formCliente.controls.telefono;
	}

	get correoElectronicoField(): FormControl<string> {
		return this.formCliente.controls.correoElectronico;
	}
}
