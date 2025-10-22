export type EstadoRental = 'activo' | 'pasado' | 'cancelado';

export interface Rental {
  id: string;
  dressId: string;
  dressNombre: string;
  foto: string;
  desde: string;            
  hasta: string;            
  precioAlquiler: number;
  estado?: EstadoRental;    
  talla?: string;
  color?: string;
}
