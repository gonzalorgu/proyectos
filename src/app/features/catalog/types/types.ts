export type Condition = 'nuevo' | 'como-nuevo' | 'usado';

export interface Dress {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;       // p.ej. 'novia' | 'gala' | 'quinceañera'
  talla: string[];         // ["S","M","L"]
  color: string;
  precioVenta: number;
  precioAlquiler: number;
  fotos: string[];
  condition: Condition;
  disponible: boolean;
  etiquetas?: string[];
}
