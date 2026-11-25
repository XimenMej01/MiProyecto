export interface Semilla {
  id: number;
  nombre: string;
  variedad: string;
  categoria: string;
  cantidad: number;
  procedencia: string;
  fechaRegistro: string;
  descripcion: string | null;
  estado: 'Disponible' | 'Agotada';
}

export interface SemillaRequest {
  nombre: string;
  variedad: string;
  categoria: string;
  cantidad: number;
  procedencia: string;
  fechaRegistro: string;
  descripcion: string;
}

export interface Estadisticas {
  totalSemillas: number;
  disponibles: number;
  agotadas: number;
  categorias: number;
}
