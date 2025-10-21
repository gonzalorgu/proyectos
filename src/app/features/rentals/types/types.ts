export type EstadoRental = 'activo' | 'pasado' | 'cancelado';

export interface Rental {
  id: string;
  dressId: string;
  dressNombre: string;
  foto: string;
  desde: string;            // ISO date (YYYY-MM-DD)
  hasta: string;            // ISO date
  precioAlquiler: number;
  estado?: EstadoRental;    // opcional: si no viene, se calcula por fecha
  talla?: string;
  color?: string;
}
