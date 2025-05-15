import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';

import { IdService } from './services/id.service';
import { IdModel, IdType } from '../models/id.model';
import { TokenDialogComponent } from './components/token-dialog/token-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  idForm: FormGroup;
  encryptedResult: string = '';
  idTypes = IdType;

  constructor(
    private fb: FormBuilder,
    private idService: IdService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.idForm = this.fb.group({
      machineId: ['', [Validators.required]],
      value: [0, [Validators.required, Validators.min(0)]],
      type: [IdType.ADD, Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    // Verificar si existe el token en localStorage
    if (!this.idService.hasToken()) {
      this.openTokenDialog(false);
    }
  }

  openTokenDialog(isChange: boolean): void {
    const dialogRef = this.dialog.open(TokenDialogComponent, {
      width: '400px',
      disableClose: !isChange, // No permitir cerrar haciendo clic fuera si es la configuración inicial
      data: { isChange }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        try {
          this.idService.saveToken(result);
          this.showToast(isChange ? 'Clave actualizada correctamente' : 'Clave configurada correctamente');
        } catch (error) {
          this.showToast('Error al guardar la clave');
          // Si es la configuración inicial y hubo un error, volver a mostrar el diálogo
          if (!isChange) {
            setTimeout(() => this.openTokenDialog(false), 500);
          }
        }
      } else if (!isChange) {
        // Si es la configuración inicial y canceló, mostrar de nuevo
        setTimeout(() => this.openTokenDialog(false), 500);
      }
    });
  }

  onSubmit() {
    if (this.idForm.valid) {
      const idModel: IdModel = {
        ...this.idForm.value,
        timestamp: Date.now()
      };

      this.encryptedResult = this.idService.encryptData(idModel, idModel.machineId);
    }
  }

  copyToClipboard() {
    if (this.encryptedResult) {
      this.clipboard.copy(this.encryptedResult);
      this.showToast('Código copiado al portapapeles');
    }
  }

  showToast(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  clearForm() {
    this.idForm.reset({
      type: IdType.ADD,
      value: 0
    });
    this.encryptedResult = '';
  }

  changeToken() {
    this.openTokenDialog(true);
  }
}
