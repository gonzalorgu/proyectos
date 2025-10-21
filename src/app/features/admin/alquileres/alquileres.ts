import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { AlquileresForm } from './alquileres.form/alquileres.form';

export interface Alquiler {
  id: number;
  cliente: string;
  clienteId?: number;
  vestido: string;
  vestidoId?: number;
  desde: string;
  hasta: string;
  estado: 'pendiente' | 'confirmado' | 'entregado' | 'devuelto' | 'cancelado';
  precio?: number;
  fechaCreacion?: Date;
  notas?: string;
}

@Component({
  selector: 'app-alquileres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alquileres.html',
  styleUrls: ['./alquileres.scss']
})
export class Alquileres implements OnInit {
  rows = signal<Alquiler[]>([]);
  alquileresFiltrados = signal<Alquiler[]>([]);
  searchTerm = signal('');
  filtroEstado = signal<string>('todos');
  ordenPor = signal<'fecha' | 'cliente' | 'estado'>('fecha');
  
  estadosDisponibles = [
    { value: 'todos', label: 'Todos los estados', color: '#6c757d' },
    { value: 'pendiente', label: 'Pendiente', color: '#ffc107' },
    { value: 'confirmado', label: 'Confirmado', color: '#17a2b8' },
    { value: 'entregado', label: 'Entregado', color: '#007bff' },
    { value: 'devuelto', label: 'Devuelto', color: '#28a745' },
    { value: 'cancelado', label: 'Cancelado', color: '#dc3545' }
  ];

  constructor(private dialog: Dialog) {}

  ngOnInit(): void {
    this.cargarAlquileres();
  }

  cargarAlquileres(): void {
    const mockAlquileres: Alquiler[] = [
      {
        id: 1,
        cliente: 'Ana María López',
        clienteId: 101,
        vestido: 'Vestido de Noche Elegante',
        vestidoId: 1,
        desde: '2025-10-20',
        hasta: '2025-10-22',
        estado: 'confirmado',
        precio: 150,
        fechaCreacion: new Date('2025-10-10'),
        notas: 'Cliente prefiere entrega a domicilio'
      },
      {
        id: 2,
        cliente: 'Carmen Rodríguez',
        clienteId: 102,
        vestido: 'Vestido de Fiesta Rojo',
        vestidoId: 2,
        desde: '2025-10-25',
        hasta: '2025-10-27',
        estado: 'pendiente',
        precio: 120,
        fechaCreacion: new Date('2025-10-12')
      },
      {
        id: 3,
        cliente: 'Laura Martínez',
        clienteId: 103,
        vestido: 'Vestido de Cóctel Negro',
        vestidoId: 3,
        desde: '2025-10-15',
        hasta: '2025-10-17',
        estado: 'devuelto',
        precio: 100,
        fechaCreacion: new Date('2025-10-05'),
        notas: 'Devuelto en perfectas condiciones'
      },
      {
        id: 4,
        cliente: 'Sofía Hernández',
        clienteId: 104,
        vestido: 'Vestido de Boda',
        vestidoId: 4,
        desde: '2025-11-01',
        hasta: '2025-11-03',
        estado: 'entregado',
        precio: 200,
        fechaCreacion: new Date('2025-10-13')
      }
    ];
    
    this.rows.set(mockAlquileres);
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let resultado = [...this.rows()];

    const search = this.searchTerm().toLowerCase();
    if (search) {
      resultado = resultado.filter(a => 
        a.cliente.toLowerCase().includes(search) ||
        a.vestido.toLowerCase().includes(search) ||
        a.id.toString().includes(search)
      );
    }

    if (this.filtroEstado() !== 'todos') {
      resultado = resultado.filter(a => a.estado === this.filtroEstado());
    }

    resultado.sort((a, b) => {
      if (this.ordenPor() === 'cliente') {
        return a.cliente.localeCompare(b.cliente);
      } else if (this.ordenPor() === 'estado') {
        return a.estado.localeCompare(b.estado);
      } else {
        return new Date(b.desde).getTime() - new Date(a.desde).getTime();
      }
    });

    this.alquileresFiltrados.set(resultado);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.aplicarFiltros();
  }

  onFiltroEstadoChange(value: string): void {
    this.filtroEstado.set(value);
    this.aplicarFiltros();
  }

  onOrdenChange(value: 'fecha' | 'cliente' | 'estado'): void {
    this.ordenPor.set(value);
    this.aplicarFiltros();
  }

  abrirModalNuevo(): void {
    const dialogRef = this.dialog.open(AlquileresForm, {
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'alquiler-modal',
      data: { alquiler: null }
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        const datos = result as Partial<Alquiler>;
        const nuevoAlquiler: Alquiler = {
          id: Date.now(),
          cliente: datos.cliente || '',
          vestido: datos.vestido || '',
          desde: datos.desde || '',
          hasta: datos.hasta || '',
          estado: datos.estado || 'pendiente',
          precio: datos.precio,
          notas: datos.notas,
          fechaCreacion: new Date()
        };
        this.rows.update(lista => [...lista, nuevoAlquiler]);
        this.aplicarFiltros();
      }
    });
  }

  abrirModalEditar(alquiler: Alquiler): void {
    const dialogRef = this.dialog.open(AlquileresForm, {
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'alquiler-modal',
      data: { alquiler }
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        const datos = result as Partial<Alquiler>;
        this.rows.update(lista => 
          lista.map(a => a.id === alquiler.id ? { ...a, ...datos } : a)
        );
        this.aplicarFiltros();
      }
    });
  }

  cambiarEstado(alquiler: Alquiler, nuevoEstado: Alquiler['estado']): void {
    this.rows.update(lista =>
      lista.map(a => a.id === alquiler.id ? { ...a, estado: nuevoEstado } : a)
    );
    this.aplicarFiltros();
  }

  eliminarAlquiler(id: number): void {
    if (confirm('¿Estás seguro de eliminar este alquiler?')) {
      this.rows.update(lista => lista.filter(a => a.id !== id));
      this.aplicarFiltros();
    }
  }

  getEstadoColor(estado: string): string {
    const estadoObj = this.estadosDisponibles.find(e => e.value === estado);
    return estadoObj?.color || '#6c757d';
  }

  getEstadoLabel(estado: string): string {
    const estadoObj = this.estadosDisponibles.find(e => e.value === estado);
    return estadoObj?.label || estado;
  }

  calcularDias(desde: string, hasta: string): number {
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    const diff = fechaHasta.getTime() - fechaDesde.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  exportarCSV(): void {
    const headers = ['ID', 'Cliente', 'Vestido', 'Desde', 'Hasta', 'Días', 'Estado', 'Precio'];
    const rows = this.alquileresFiltrados().map(a => [
      a.id,
      a.cliente,
      a.vestido,
      a.desde,
      a.hasta,
      this.calcularDias(a.desde, a.hasta),
      a.estado,
      a.precio || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alquileres.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}