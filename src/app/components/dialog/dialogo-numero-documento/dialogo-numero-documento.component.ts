import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialogo-numero-documento',
  standalone: true,
  imports: [MatDialogModule, MatIcon, MatButtonModule],
  templateUrl: './dialogo-numero-documento.component.html',
  styleUrl: './dialogo-numero-documento.component.scss'
})
export class DialogoNumeroDocumentoComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { numeroDocumento: string },
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogoNumeroDocumentoComponent>
  ) {}

  copiar() {
    navigator.clipboard.writeText(this.data.numeroDocumento).then(() => {
      this.snackBar.open('Número copiado al portapapeles', 'Cerrar', { duration: 2000 });
    });
  }
}
