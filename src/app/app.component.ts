import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';

import { IdService } from './services/id.service';
import { IdModel, IdType } from '../models/id.model';

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
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  idForm: FormGroup;
  encryptedResult: string = '';
  idTypes = IdType;

  constructor(
    private fb: FormBuilder,
    private idService: IdService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) {
    this.idForm = this.fb.group({
      machineId: ['', [Validators.required]],
      value: [0, [Validators.required, Validators.min(0)]],
      type: [IdType.ADD, Validators.required],
      description: ['']
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
}
