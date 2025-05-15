import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-token-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.isChange ? 'Cambiar Clave de Seguridad' : 'Configurar Clave de Seguridad' }}</h2>
    <div mat-dialog-content>
      <p>{{ data.isChange ? 'Ingrese una nueva clave de seguridad para el generador de claves.' : 'Para utilizar el generador de claves, es necesario configurar una clave de seguridad.' }}</p>
      <form [formGroup]="tokenForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Clave de Seguridad</mat-label>
          <input matInput formControlName="token" type="password" required>
          <mat-error *ngIf="tokenForm.get('token')?.hasError('required')">
            La clave de seguridad es requerida
          </mat-error>
          <mat-error *ngIf="tokenForm.get('token')?.hasError('minlength')">
            La clave debe tener al menos 8 caracteres
          </mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()" *ngIf="data.isChange">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!tokenForm.valid">Guardar</button>
    </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    mat-dialog-content {
      min-width: 300px;
    }
  `]
})
export class TokenDialogComponent {
  tokenForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isChange: boolean }
  ) {
    this.tokenForm = this.fb.group({
      token: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSave(): void {
    if (this.tokenForm.valid) {
      this.dialogRef.close(this.tokenForm.value.token);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}