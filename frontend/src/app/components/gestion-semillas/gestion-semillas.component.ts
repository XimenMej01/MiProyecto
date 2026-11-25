
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { SemillaService } from '../../services/semilla.service';
import { Semilla, SemillaRequest } from '../../models/semilla.model';

@Component({
  selector: 'app-gestion-semillas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './gestion-semillas.component.html',
  styleUrl: './gestion-semillas.component.css'
})
export class GestionSemillasComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(SemillaService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly categorias = [
    'Hortaliza',
    'Frutal',
    'Medicinal',
    'Ornamental',
    'Leguminosa',
    'Cereal'
  ];

  semillas: Semilla[] = [];

  cargando = false;
  guardando = false;
  mostrarFormulario = false;

  idEdicion: number | null = null;

  busqueda = '';
  filtroCategoria = '';
  errorCarga = '';

  hoy = this.obtenerFechaLocal();

  formulario = this.fb.nonNullable.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[\p{L}\p{M}\s'-]+$/u)
      ]
    ],
    variedad: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    ],
    categoria: [
      '',
      [Validators.required]
    ],
    cantidad: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(99999999.99)
      ]
    ],
    procedencia: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150)
      ]
    ],
    fechaRegistro: [
      this.hoy,
      [Validators.required]
    ],
    descripcion: [
      '',
      [Validators.maxLength(500)]
    ]
  });

  ngOnInit(): void {
    this.cargarSemillas();
  }

  get authNombre(): string {
    return this.auth.getNombre();
  }

  get authNombreInicial(): string {
    return this.auth.getNombre().charAt(0).toUpperCase();
  }

  get semillasFiltradas(): Semilla[] {
    const texto = this.busqueda.trim().toLocaleLowerCase();

    return this.semillas.filter((semilla) => {
      const coincideTexto =
        !texto ||
        `${semilla.nombre} ${semilla.variedad} ${semilla.procedencia}`
          .toLocaleLowerCase()
          .includes(texto);

      const coincideCategoria =
        !this.filtroCategoria ||
        semilla.categoria === this.filtroCategoria;

      return coincideTexto && coincideCategoria;
    });
  }

  // Cargar las semillas registradas
  cargarSemillas(): void {
    this.cargando = true;
    this.errorCarga = '';

    this.cdr.markForCheck();

    this.api.listar().subscribe({
      next: (datos) => {
        this.semillas = datos;
        this.cargando = false;

        this.cdr.markForCheck();
      },

      error: (err: HttpErrorResponse) => {
        this.cargando = false;

        if (err.status === 401) {
          this.cdr.markForCheck();
          this.cerrarSesion();
          return;
        }

        this.errorCarga =
          'No se pudieron cargar las semillas. Comprueba que la API y MariaDB estén activos.';

        this.cdr.markForCheck();
      }
    });
  }

  // Abrir formulario para registrar una nueva semilla
  nuevoRegistro(): void {
    this.idEdicion = null;

    this.formulario.reset({
      nombre: '',
      variedad: '',
      categoria: '',
      cantidad: 0,
      procedencia: '',
      fechaRegistro: this.hoy,
      descripcion: ''
    });

    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();

    this.mostrarFormulario = true;

    this.cdr.markForCheck();
  }

  // Editar una semilla existente
  editar(semilla: Semilla): void {
    this.idEdicion = semilla.id;

    this.formulario.reset({
      nombre: semilla.nombre,
      variedad: semilla.variedad,
      categoria: semilla.categoria,
      cantidad: semilla.cantidad,
      procedencia: semilla.procedencia,
      fechaRegistro: semilla.fechaRegistro,
      descripcion: semilla.descripcion ?? ''
    });

    this.mostrarFormulario = true;

    this.cdr.markForCheck();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Cerrar y limpiar el formulario
  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.idEdicion = null;

    this.formulario.reset({
      nombre: '',
      variedad: '',
      categoria: '',
      cantidad: 0,
      procedencia: '',
      fechaRegistro: this.hoy,
      descripcion: ''
    });

    this.cdr.markForCheck();
  }

  // Registrar o actualizar una semilla
  guardar(): void {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    const datos = this.formulario.getRawValue() as SemillaRequest;

    const actualizado = this.idEdicion !== null;

    this.guardando = true;
    this.cdr.markForCheck();

    const peticion = actualizado
      ? this.api.actualizar(this.idEdicion!, datos)
      : this.api.registrar(datos);

    peticion.subscribe({

      // Cuando Spring Boot responde correctamente
      next: () => {
        this.guardando = false;

        this.cancelarFormulario();

        this.cdr.markForCheck();

        // Actualizar la tabla con los datos de la API
        this.cargarSemillas();

        void Swal.fire({
          icon: 'success',
          title: actualizado
            ? 'Registro actualizado'
            : 'Semilla registrada',
          text: actualizado
            ? 'Los cambios se guardaron correctamente.'
            : 'La semilla se agregó al banco comunitario.',
          confirmButtonColor: '#34734d'
        });
      },

      // Cuando ocurre un error en el registro
      error: (err: HttpErrorResponse) => {
        this.guardando = false;

        this.cdr.markForCheck();

        const mensaje =
          err.error?.mensaje ??
          'No se pudo guardar la información. Verifica los datos e inténtalo nuevamente.';

        void Swal.fire({
          icon: 'error',
          title: 'No se pudo guardar',
          text: mensaje,
          confirmButtonColor: '#34734d'
        });
      }
    });
  }

  // Confirmar eliminación de una semilla
  async confirmarEliminar(semilla: Semilla): Promise<void> {

    const confirmacion = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar esta semilla?',
      text: `Se eliminará ${semilla.nombre} - ${semilla.variedad}. Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#b54747',
      cancelButtonColor: '#6b7c70',
      reverseButtons: true
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    this.api.eliminar(semilla.id).subscribe({

      next: () => {
        this.cargarSemillas();

        void Swal.fire({
          icon: 'success',
          title: 'Semilla eliminada',
          text: 'El registro se eliminó correctamente.',
          confirmButtonColor: '#34734d'
        });
      },

      error: (err: HttpErrorResponse) => {
        void Swal.fire({
          icon: 'error',
          title: 'No se pudo eliminar',
          text: err.error?.mensaje ??
            'Ocurrió un error al eliminar el registro.',
          confirmButtonColor: '#34734d'
        });
      }
    });
  }

  // Cerrar sesión
  cerrarSesion(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  // Mensajes de validación del formulario
  obtenerError(campo: string): string {
    const control = this.formulario.get(campo);

    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Este campo es obligatorio.';
    }

    if (control.hasError('minlength')) {
      return `Debe contener al menos ${control.getError('minlength').requiredLength} caracteres.`;
    }

    if (control.hasError('maxlength')) {
      return `No puede superar ${control.getError('maxlength').requiredLength} caracteres.`;
    }

    if (control.hasError('min')) {
      return 'La cantidad no puede ser negativa.';
    }

    if (control.hasError('max')) {
      return 'La cantidad supera el límite permitido.';
    }

    if (control.hasError('pattern')) {
      return 'Utiliza letras y espacios, sin números.';
    }

    return 'Verifica este campo.';
  }

  // Obtener la fecha local en formato YYYY-MM-DD
  private obtenerFechaLocal(): string {
    const fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }
}
