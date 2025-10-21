import { Component, inject } from '@angular/core';
import { RentalsStore } from '../rentals.store/rentals.store';
import { RentalCard } from "../rental-card/rental-card";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rentals.page',
  imports: [RentalCard,CommonModule],
  templateUrl: './rentals.page.html',
  styleUrl: './rentals.page.scss'
})
export class RentalsPage {
  store = inject(RentalsStore);

  // Handlers Signals (Angular 20)
  onQ(e: Event){ this.store.setQ((e.target as HTMLInputElement).value); }
  onEstado(e: Event){ this.store.setEstado((e.target as HTMLSelectElement).value as any); }

  // Rango rápido: último mes / 3 meses
  setQuickRange(kind: '30d'|'90d') {
    const now = new Date(); now.setHours(0,0,0,0);
    const from = new Date(now);
    from.setDate(now.getDate() - (kind === '30d' ? 30 : 90));
    const iso = (d: Date) => d.toISOString().slice(0,10);
    this.store.setDesde(iso(from));
    this.store.setHasta(iso(now));
  }
}

