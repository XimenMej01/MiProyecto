import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { SemillaService } from '../../services/semilla.service';
import { Estadisticas } from '../../models/semilla.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly semillaService = inject(SemillaService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  nombre = this.auth.getNombre();
  estadisticas: Estadisticas = { totalSemillas: 0, disponibles: 0, agotadas: 0, categorias: 0 };
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargando = true;
    this.error = '';
    this.semillaService.estadisticas().subscribe({
      next: (datos) => { this.estadisticas = datos; this.cargando = false; },
      error: (err: HttpErrorResponse) => {
        this.cargando = false;
        this.error = err.status === 401 ? 'Tu sesion vencio. Inicia sesion nuevamente.' : 'No se pudieron cargar las estadisticas.';
        if (err.status === 401) this.cerrarSesion();
      }
    });
  }

  cerrarSesion(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
