import { Component, Inject, inject } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-modal-inactividad',
  standalone: true,
  imports: [MatButtonModule, MatIcon],
  templateUrl: './modal-inactividad.component.html',
  styleUrl: './modal-inactividad.component.scss'
})
export class ModalInactividadComponent {
  private servicio = inject(LoginService);

  constructor(public dialogRef: MatDialogRef<ModalInactividadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tiempoRestante: number }
  ) {}
  
  continuar(){
    this.dialogRef.close(true);
    this.servicio.resetear();
  }
}
