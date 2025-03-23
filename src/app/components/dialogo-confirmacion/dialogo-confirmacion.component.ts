import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dialogo-confirmacion',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIcon],
  templateUrl: './dialogo-confirmacion.component.html',
  styleUrl: './dialogo-confirmacion.component.scss'
})
export class DialogoConfirmacionComponent {
 constructor(
    public dialogRef: MatDialogRef<DialogoConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {}

  cerrar(): void {
    this.dialogRef.close(false);
  }

  eliminar(): void {
    this.dialogRef.close(true);
  }
}
