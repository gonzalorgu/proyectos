import { Injectable, computed, signal } from '@angular/core';
import { Rental } from '../types/types.js';

function todayISO() {
  const d = new Date(); d.setHours(0,0,0,0);
  return d.toISOString().slice(0,10);
}

/** Datos mock (puedes duplicar/cambiar) */
const RENTALS: Rental[] = [
  { id:'r1', dressId:'1', dressNombre:'Vestido color amarillo', foto:'../../../../assets/3.jpg',
    desde:'2025-09-18', hasta:'2025-09-22', precioAlquiler:320, talla:'M', color:'dorado' },

  { id:'r2', dressId:'3', dressNombre:'Vestido color encaje', foto:'../../../../assets/4.jpg',
    desde:'2025-08-10', hasta:'2025-08-12', precioAlquiler:300, talla:'S', color:'negro' },

  { id:'r3', dressId:'1', dressNombre:'Vestido novia minimal', foto:'../../../../assets/3.jpg',
    desde:'2025-07-25', hasta:'2025-07-28', precioAlquiler:285, talla:'M', color:'blanco' },

  { id:'r4', dressId:'2', dressNombre:'Vestido color amarillo', foto:'../../../../assets/5.jpg',
    desde:'2025-10-20', hasta:'2025-10-23', precioAlquiler:330, talla:'L', color:'dorado' },
];

@Injectable({ providedIn: 'root' })
export class RentalsStore {
  private all = signal<Rental[]>(RENTALS.map(r => ({
    ...r,
    estado: r.estado ?? (r.hasta >= todayISO() ? 'activo' : 'pasado')
  })));

  // Filtros UI
  q = signal('');
  estado = signal<'todos' | 'activos' | 'pasados'>('todos');
  desde = signal<string>('');
  hasta = signal<string>('');

  // Derivados
  filtered = computed(() => {
    const term = this.q().trim().toLowerCase();
    const est = this.estado();
    const fDesde = this.desde();
    const fHasta = this.hasta();

    return this.all().filter(r => {
      if (term && !(`${r.dressNombre} ${r.color ?? ''} ${r.talla ?? ''}`.toLowerCase().includes(term))) return false;
      if (est === 'activos' && r.estado !== 'activo') return false;
      if (est === 'pasados' && r.estado !== 'pasado') return false;
      if (fDesde && r.desde < fDesde) return false;
      if (fHasta && r.hasta > fHasta) return false;
      return true;
    });
  });

  activos = computed(() => this.filtered().filter(r => r.estado === 'activo'));
  pasados = computed(() => this.filtered().filter(r => r.estado === 'pasado'));

  // Acciones filtros
  setQ(v:string){ this.q.set(v); }
  setEstado(v:'todos'|'activos'|'pasados'){ this.estado.set(v); }
  setDesde(v:string){ this.desde.set(v); }
  setHasta(v:string){ this.hasta.set(v); }
}
