import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  cargando = false;
  error = '';
  mostrarPassword = false;

  formulario = this.fb.nonNullable.group({
    correo: ['admin@bancosemillas.local', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor() {
    if (this.auth.isAuthenticated()) {
      void this.router.navigate(['/dashboard']);
    }
  }

  ingresar(): void {
    this.error = '';
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.auth.login(this.formulario.getRawValue())
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: () => void this.router.navigate(['/dashboard']),
        error: (err: HttpErrorResponse) => {
          this.error = err.error?.mensaje ?? 'No se pudo iniciar sesion. Comprueba que la API este ejecutandose.';
        }
      });
  }
}
