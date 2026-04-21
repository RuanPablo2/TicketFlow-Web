import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, 
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;
  hidePassword = true;

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      this.authService.registerClient(this.registerForm.value).subscribe({
        next: () => {
          this.snackBar.open('✅ Account created successfully! Please log in.', 'Close', { duration: 5000 });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          const errorMsg = err.error?.message || 'Error creating account. Email may already be in use.';
          this.snackBar.open(`❌ ${errorMsg}`, 'Close', { duration: 5000 });
        }
      });
    }
  }
}