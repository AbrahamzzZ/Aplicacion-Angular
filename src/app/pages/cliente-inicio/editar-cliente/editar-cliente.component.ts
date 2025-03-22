import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validaciones } from '../../../../utility/validaciones';
import { MatCardModule } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClienteService } from '../../../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-cliente',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './editar-cliente.component.html',
  styleUrl: './editar-cliente.component.scss'
})
export class EditarClienteComponent implements OnInit{
  private clienteServicio = inject(ClienteService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  idCliente!: number;
    
  public formCliente = this.formBuilder.nonNullable.group({
    nombres: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
    apellidos: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloNumeros()]],
    cedula: ['', [Validators.required, Validaciones.soloNumeros()]],
    telefono: ['', [Validators.required, Validaciones.soloNumeros()]],
    correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]]
  });
    
  constructor(private router: Router) {}
    
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idCliente = +params['id']; 
      if (this.idCliente) {
        this.cargarCliente();
      }
    });
  }
    
  cargarCliente(): void {
    this.clienteServicio.obtener(this.idCliente).subscribe({
      next: (data) => {
        if (data) {
          this.formCliente.patchValue({
              nombres: data.nombres,
              apellidos: data.apellidos,
              cedula: data.cedula,
              telefono: data.telefono,
              correoElectronico: data.correo_Electronico
            });
          }
        },
        error: (err) => {
      console.error('Error al obtener cliente:', err);
      }
    });
  }

  regresar(){
    this.router.navigate(["/cliente"]);
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

    /*guadar(){
      const cliente: ICliente = {
        id: this.idCliente,
        nombres: this.formCliente.value.nombres,
      }
    }*/
}
