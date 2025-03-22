import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Validaciones } from '../../../../utility/validaciones';
import { ProveedorService } from '../../../../services/proveedor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-proveedor',
  standalone: true,
  imports: [MatCardModule, MatInput, MatFormFieldModule, MatButton, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './editar-proveedor.component.html',
  styleUrl: './editar-proveedor.component.scss'
})
export class EditarProveedorComponent implements OnInit{
  private proveedorServicio = inject(ProveedorService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  idProveedor!: number;

  public formProveedor = this.formBuilder.nonNullable.group({
      nombres: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
      apellidos: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validaciones.soloLetras()]],
      cedula: ['', [Validators.required, Validaciones.soloNumeros()]],
      telefono: ['', [Validators.required, Validaciones.soloNumeros()]],
      correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      estado: [false]
  });

  constructor(private router: Router) {}
    
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idProveedor = +params['id']; 
      if (this.idProveedor) {
        this.cargarProvedor();
      }
    });
  }
    
  cargarProvedor(): void {
    this.proveedorServicio.obtener(this.idProveedor).subscribe({
      next: (data) => {
        if (data) {
          this.formProveedor.patchValue({
              nombres: data.nombres,
              apellidos: data.apellidos,
              cedula: data.cedula,
              telefono: data.telefono,
              correoElectronico: data.correo_Electronico,
              estado: data.estado
            });
          }
        },
        error: (err) => {
      console.error('Error al obtener proveedor:', err);
      }
    });
  }

  regresar(){
    this.router.navigate(["/proveedor"]);
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
