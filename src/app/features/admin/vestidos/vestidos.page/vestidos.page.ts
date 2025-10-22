import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { VestidosForm } from '../vestidos.form/vestidos.form';
import { VestidosList } from '../vestidos.list/vestidos.list';
import { VestidosStore, Vestido } from '../vestidos.store/vestidos.store';

@Component({
  selector: 'app-vestidos-page',
  imports: [CommonModule, VestidosList],
  templateUrl: './vestidos.page.html',
  styleUrls: ['./vestidos.page.scss']
})
export class VestidosPage implements OnInit {
  private store = inject(VestidosStore);
  private dialog = inject(Dialog);
  
  vestidos = this.store.vestidos;
  loading = this.store.loading;

  ngOnInit(): void {
    this.loadVestidos();
  }

  loadVestidos(): void {
    this.store.setLoading(true);
    
    setTimeout(() => {
      const mockVestidos: Vestido[] = [
        {
          id: 1,
          nombre: 'Vestido de Noche Elegante',
          talla: 'M',
          color: 'Negro',
          precio: 150,
          descripcion: 'Hermoso vestido de noche con detalles en encaje',
          imagen: '',
          disponible: true,
          categoria: 'Formal'
        },
        {
          id: 2,
          nombre: 'Vestido de Fiesta',
          talla: 'S',
          color: 'Rojo',
          precio: 120,
          descripcion: 'Vestido perfecto para fiestas y eventos especiales',
          imagen: '',
          disponible: true,
          categoria: 'Fiesta'
        }
      ];
      this.store.setVestidos(mockVestidos);
    }, 1000);
  }

  abrirModalNuevo(): void {
    const dialogRef = this.dialog.open(VestidosForm, {
      width: '700px',
      maxWidth: '90vw',
      panelClass: 'vestido-modal',
      data: { vestido: null }
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        const newVestido: Vestido = {
          ...result as Vestido,
          id: Date.now()
        };
        this.store.addVestido(newVestido);
      }
    });
  }

  onEditVestido(vestido: Vestido): void {
    const dialogRef = this.dialog.open(VestidosForm, {
      width: '700px',
      maxWidth: '90vw',
      panelClass: 'vestido-modal',
      data: { vestido }
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.store.updateVestido(vestido.id, result);
      }
    });
  }

  onDeleteVestido(id: number): void {
    if (confirm('¿Estás seguro de eliminar este vestido?')) {
      this.store.removeVestido(id);
    }
  }

  onToggleDisponible(vestido: Vestido): void {
    this.store.updateVestido(vestido.id, {
      disponible: !vestido.disponible
    });
  }
}