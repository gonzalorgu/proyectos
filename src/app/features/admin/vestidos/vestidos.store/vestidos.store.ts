import { Injectable } from '@angular/core';
import { computed, signal } from '@angular/core';

export interface Vestido {
  id: number;
  nombre: string;
  talla: string;
  color: string;
  precio: number;
  descripcion?: string;
  imagen?: string;
  disponible: boolean;
  categoria?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VestidosStore {
  // Signals para manejo de estado
  private vestidosSignal = signal<Vestido[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals para acceso público
  vestidos = computed(() => this.vestidosSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());
  
  // Computed para vestidos disponibles
  vestidosDisponibles = computed(() => 
    this.vestidosSignal().filter(v => v.disponible)
  );

  setVestidos(vestidos: Vestido[]): void {
    this.vestidosSignal.set(vestidos);
    this.loadingSignal.set(false);
  }

  addVestido(vestido: Vestido): void {
    this.vestidosSignal.update(current => [...current, vestido]);
  }

  updateVestido(id: number, vestido: Partial<Vestido>): void {
    this.vestidosSignal.update(current =>
      current.map(v => v.id === id ? { ...v, ...vestido } : v)
    );
  }

  removeVestido(id: number): void {
    this.vestidosSignal.update(current =>
      current.filter(v => v.id !== id)
    );
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setError(error: string | null): void {
    this.errorSignal.set(error);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}