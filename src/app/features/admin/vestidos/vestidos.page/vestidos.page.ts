import { Component, OnInit, signal, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VestidosForm } from '../vestidos.form/vestidos.form';
import { VestidosList } from '../vestidos.list/vestidos.list';
import { VestidosStore, Vestido } from '../vestidos.store/vestidos.store';

@Component({
  selector: 'app-vestidos-page',
  standalone: true,
  imports: [CommonModule, VestidosForm, VestidosList],
  templateUrl: './vestidos.page.html',
  styleUrls: ['./vestidos.page.scss'],
  encapsulation: ViewEncapsulation.Emulated 

})
export class VestidosPage implements OnInit {
  // Usar inject() en lugar de constructor para evitar el error de inicialización
  private store = inject(VestidosStore);
  
  showForm = signal(false);
  editingVestido = signal<Vestido | undefined>(undefined);

  // Ahora store ya está inicializado
  vestidos = this.store.vestidos;
  loading = this.store.loading;

  ngOnInit(): void {
    this.loadVestidos();
  }

  loadVestidos(): void {
    this.store.setLoading(true);
    
    // Simulación de carga desde API
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

  toggleForm(): void {
    this.showForm.update(show => !show);
    if (!this.showForm()) {
      this.editingVestido.set(undefined);
    }
  }

  onSubmitVestido(vestidoData: Partial<Vestido>): void {
    if (this.editingVestido()) {
      this.store.updateVestido(this.editingVestido()!.id, vestidoData);
    } else {
      const newVestido: Vestido = {
        ...vestidoData as Vestido,
        id: Date.now()
      };
      this.store.addVestido(newVestido);
    }
    
    this.showForm.set(false);
    this.editingVestido.set(undefined);
  }

  onCancelForm(): void {
    this.showForm.set(false);
    this.editingVestido.set(undefined);
  }

  onEditVestido(vestido: Vestido): void {
    this.editingVestido.set(vestido);
    this.showForm.set(true);
  }

  onDeleteVestido(id: number): void {
    this.store.removeVestido(id);
  }

  onToggleDisponible(vestido: Vestido): void {
    this.store.updateVestido(vestido.id, {
      disponible: !vestido.disponible
    });
  }
}