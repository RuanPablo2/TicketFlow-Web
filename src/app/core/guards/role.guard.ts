import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  
  const userRole = authService.getUserRole();

  const expectedRoles = route.data['roles'] as Array<string>;

  if (expectedRoles && userRole && expectedRoles.includes(userRole)) {
    return true; 
  }

  snackBar.open('⛔ Access Denied: You do not have permission to access this area.', 'Close', { duration: 5000 });
  router.navigate(['/tickets']);
  return false;
};