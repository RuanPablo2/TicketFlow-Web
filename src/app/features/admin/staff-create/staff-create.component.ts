import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-staff-create',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, 
    MatSelectModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './staff-create.component.html',
  styleUrl: './staff-create.component.scss'
})
export class StaffCreateComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;

  staffForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['SUPPORT', [Validators.required]]
  });

  onSubmit() {
    if (this.staffForm.valid) {
      this.isLoading = true;

      this.authService.registerStaff(this.staffForm.value).subscribe({
        next: () => {
          this.snackBar.open('✅ Staff account created successfully!', 'Close', { duration: 4000 });
          this.router.navigate(['/tickets']);
        },
        error: (err) => {
          this.isLoading = false;
          const errorMsg = err.error?.message || 'Error creating account. Check the data.';
          this.snackBar.open(`❌ ${errorMsg}`, 'Close', { duration: 5000 });
        }
      });
    }
  }
}