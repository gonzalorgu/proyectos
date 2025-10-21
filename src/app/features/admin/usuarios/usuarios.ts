import { Component, OnInit, signal ,ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { UsuariosForm } from './usuarios.form/usuarios.form';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  activo: boolean;
  rol?: 'admin' | 'cliente';
  fechaRegistro?: Date;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl:'./usuarios.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class Usuarios implements OnInit {
  usuarios = signal<Usuario[]>([]);
  usuariosFiltrados = signal<Usuario[]>([]);
  searchTerm = signal('');
  filtroEstado = signal<'todos' | 'activos' | 'inactivos'>('todos');
  ordenPor = signal<'nombre' | 'email' | 'fecha'>('nombre');
  
  constructor(private dialog: Dialog) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    const mockUsuarios: Usuario[] = [
      {
        id: 1,
        nombre: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        telefono: '5551234567',
        activo: true,
        rol: 'cliente',
        fechaRegistro: new Date('2024-01-15')
      },
      {
        id: 2,
        nombre: 'María González',
        email: 'maria@ejemplo.com',
        telefono: '5559876543',
        activo: true,
        rol: 'admin',
        fechaRegistro: new Date('2024-02-20')
      },
      {
        id: 3,
        nombre: 'Carlos López',
        email: 'carlos@ejemplo.com',
        telefono: '5555551234',
        activo: false,
        rol: 'cliente',
        fechaRegistro: new Date('2024-03-10')
      }
    ];
    
    this.usuarios.set(mockUsuarios);
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let resultado = [...this.usuarios()];

    const search = this.searchTerm().toLowerCase();
    if (search) {
      resultado = resultado.filter(u => 
        u.nombre.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.telefono?.includes(search)
      );
    }

    if (this.filtroEstado() === 'activos') {
      resultado = resultado.filter(u => u.activo);
    } else if (this.filtroEstado() === 'inactivos') {
      resultado = resultado.filter(u => !u.activo);
    }

    resultado.sort((a, b) => {
      if (this.ordenPor() === 'nombre') {
        return a.nombre.localeCompare(b.nombre);
      } else if (this.ordenPor() === 'email') {
        return a.email.localeCompare(b.email);
      } else {
        return (b.fechaRegistro?.getTime() || 0) - (a.fechaRegistro?.getTime() || 0);
      }
    });

    this.usuariosFiltrados.set(resultado);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.aplicarFiltros();
  }

  onFiltroEstadoChange(value: 'todos' | 'activos' | 'inactivos'): void {
    this.filtroEstado.set(value);
    this.aplicarFiltros();
  }

  onOrdenChange(value: 'nombre' | 'email' | 'fecha'): void {
    this.ordenPor.set(value);
    this.aplicarFiltros();
  }

  abrirModalNuevo(): void {
    const dialogRef = this.dialog.open(UsuariosForm, {
      width: '700px',
      maxWidth: '90vw',
      panelClass: 'usuario-modal',
      data: { usuario: null }
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        const datos = result as Partial<Usuario>;
        const nuevoUsuario: Usuario = {
          id: Date.now(),
          nombre: datos.nombre || '',
          email: datos.email || '',
          telefono: datos.telefono,
          activo: datos.activo ?? true,
          rol: datos.rol || 'cliente',
          fechaRegistro: new Date()
        };
        this.usuarios.update(lista => [...lista, nuevoUsuario]);
        this.aplicarFiltros();
      }
    });
  }

  abrirModalEditar(usuario: Usuario): void {
    const dialogRef = this.dialog.open(UsuariosForm, {
      width: '700px',
      maxWidth: '90vw',
      panelClass: 'usuario-modal',
      data: { usuario }
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        const datos = result as Partial<Usuario>;
        this.usuarios.update(lista => 
          lista.map(u => u.id === usuario.id ? { ...u, ...datos } : u)
        );
        this.aplicarFiltros();
      }
    });
  }

  toggleEstado(usuario: Usuario): void {
    this.usuarios.update(lista =>
      lista.map(u => u.id === usuario.id ? { ...u, activo: !u.activo } : u)
    );
    this.aplicarFiltros();
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarios.update(lista => lista.filter(u => u.id !== id));
      this.aplicarFiltros();
    }
  }

  exportarCSV(): void {
    const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Estado', 'Rol'];
    const rows = this.usuariosFiltrados().map(u => [
      u.id,
      u.nombre,
      u.email,
      u.telefono || '',
      u.activo ? 'Activo' : 'Inactivo',
      u.rol || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}