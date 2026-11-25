import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GestionSemillasComponent } from './components/gestion-semillas/gestion-semillas.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'semillas', component: GestionSemillasComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
