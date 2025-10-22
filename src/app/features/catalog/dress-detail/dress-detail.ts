import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { DressCard } from '../dress-card/dress-card';
import { CatalogStore } from '../catalog.store/catalog.store';
import { ReservationDialog } from '../reservation-dialog/reservation-dialog';

@Component({
  selector: 'app-dress-detail',
  imports: [CommonModule, RouterLink, DressCard],
  templateUrl: './dress-detail.html',
  styleUrl: './dress-detail.scss'
})
export class DressDetail {
  private route = inject(ActivatedRoute);
  private store = inject(CatalogStore);
  private dialog = inject(Dialog);

  id = signal<string>('');
  dress = computed(() => this.store.byId(this.id()));
  related = computed(() => this.store.relatedTo(this.id(), 4));

  size = signal<string>('');
  fit = signal<boolean>(false);
  qty = signal<number>(1);
  purchaseType = signal<'venta' | 'alquiler'>('alquiler');
  selectedPhotoIndex = signal<number>(0);

  currentPrice = computed(() => {
    const d = this.dress();
    if (!d) return 0;
    return this.purchaseType() === 'venta' ? (d.precioVenta || 0) : d.precioAlquiler;
  });

  actionButtonText = computed(() => {
    return this.purchaseType() === 'venta' ? 'Comprar' : 'Reservar';
  });

  constructor() {
    const pid = this.route.snapshot.paramMap.get('id') ?? '';
    this.id.set(pid);
    const d = this.store.byId(pid);
    if (d?.talla?.length) this.size.set(d.talla[0]);
  }

  selectPhoto(index: number) {
    this.selectedPhotoIndex.set(index);
  }

  setPurchaseType(type: 'venta' | 'alquiler') {
    this.purchaseType.set(type);
  }

  setSize(t: string) { 
    this.size.set(t); 
  }
  
  toggleFit(e: Event) { 
    this.fit.set((e.target as HTMLInputElement).checked); 
  }
  
  inc() { 
    this.qty.set(this.qty() + 1); 
  }
  
  dec() { 
    this.qty.set(Math.max(1, this.qty() - 1)); 
  }
  
  onQty(e: Event) {
    const v = parseInt((e.target as HTMLInputElement).value || '1', 10);
    this.qty.set(Number.isFinite(v) ? Math.max(1, v) : 1);
  }

  addToCart() {
    alert(`Añadido (demo):
- id: ${this.id()}
- tipo: ${this.purchaseType()}
- precio: S/ ${this.currentPrice()}
- talla: ${this.size()}
- ajuste: ${this.fit()}
- cantidad: ${this.qty()}`);
  }

  openReservation() {
    const d = this.dress();
    if (!d) return;

    const dialogRef = this.dialog.open(ReservationDialog, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: 'reservation-modal',
      data: {
        dressId: d.id,
        dressName: d.nombre,
        dressPrice: this.currentPrice(),
        purchaseType: this.purchaseType()
      }
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.handleReservation(result);
      }
    });
  }

  handleReservation(data: any) {
    const actionType = this.purchaseType() === 'venta' ? 'Compra' : 'Reserva';
    alert(`¡${actionType} confirmada!
Vestido: ${data.vestidoNombre}
Tipo: ${this.purchaseType()}
Precio: S/ ${this.currentPrice()}
Nombre: ${data.nombre}
Fecha inicio: ${data.fechaInicio}
Fecha fin: ${data.fechaFin}
Email: ${data.email}
Teléfono: ${data.telefono}`);
  }
}