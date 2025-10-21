import { Component, EventEmitter, Input, Output,ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vestido } from '../vestidos.store/vestidos.store';

@Component({
  selector: 'app-vestidos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vestidos.list.html',  
  styleUrls: ['./vestidos.list.scss'],  
  encapsulation: ViewEncapsulation.Emulated  
})
export class VestidosList {
  @Input() vestidos: Vestido[] = [];
  @Input() loading: boolean = false;
  @Output() editVestido = new EventEmitter<Vestido>();
  @Output() deleteVestido = new EventEmitter<number>();
  @Output() toggleDisponible = new EventEmitter<Vestido>();

  onEdit(vestido: Vestido): void {
    this.editVestido.emit(vestido);
  }

  onDelete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este vestido?')) {
      this.deleteVestido.emit(id);
    }
  }

  onToggleDisponible(vestido: Vestido): void {
    this.toggleDisponible.emit(vestido);
  }

  trackByVestidoId(index: number, vestido: Vestido): number {
    return vestido.id;
  }
}