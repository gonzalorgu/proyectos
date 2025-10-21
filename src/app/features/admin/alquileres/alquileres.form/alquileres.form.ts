import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

export interface Alquiler {
  id?: number;
  cliente: string;
  vestido: string;
  desde: string;
  hasta: string;
  estado: 'pendiente' | 'confirmado' | 'entregado' | 'devuelto' | 'cancelado';
  precio?: number;
  notas?: string;
}

@Component({
  selector: 'app-alquileres-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alquileres.form.html',
  styleUrls: ['./alquileres.form.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlquileresForm implements OnInit {
  alquilerForm!: FormGroup;

  estados = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'entregado', label: 'Entregado' },
    { value: 'devuelto', label: 'Devuelto' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  clientes = [
    { id: 101, nombre: 'Ana María López' },
    { id: 102, nombre: 'Carmen Rodríguez' },
    { id: 103, nombre: 'Laura Martínez' },
    { id: 104, nombre: 'Sofía Hernández' }
  ];

  vestidos = [
    { id: 1, nombre: 'Vestido de Noche Elegante', precio: 150 },
    { id: 2, nombre: 'Vestido de Fiesta Rojo', precio: 120 },
    { id: 3, nombre: 'Vestido de Cóctel Negro', precio: 100 },
    { id: 4, nombre: 'Vestido de Boda', precio: 200 }
  ];

  constructor(
    private fb: FormBuilder,
    @Optional() public dialogRef: DialogRef<Partial<Alquiler> | undefined>,  // ← CORREGIDO
    @Optional() @Inject(DIALOG_DATA) public data: { alquiler: Alquiler | null }
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.data?.alquiler) {
      this.alquilerForm.patchValue(this.data.alquiler);
    }
  }

  initForm(): void {
    const hoy = new Date().toISOString().split('T')[0];
    
    this.alquilerForm = this.fb.group({
      cliente: ['', Validators.required],
      vestido: ['', Validators.required],
      desde: [hoy, Validators.required],
      hasta: ['', Validators.required],
      estado: ['pendiente', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      notas: ['']
    });
  }

  onVestidoChange(vestidoNombre: string): void {
    const vestidoSeleccionado = this.vestidos.find(v => v.nombre === vestidoNombre);
    if (vestidoSeleccionado) {
      this.alquilerForm.patchValue({ precio: vestidoSeleccionado.precio });
    }
  }

  onSubmit(): void {
    if (this.alquilerForm.valid) {
      const formData: Partial<Alquiler> = this.alquilerForm.value;
      this.dialogRef?.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef?.close(undefined);
  }

  get f() {
    return this.alquilerForm.controls;
  }

  get isEditMode(): boolean {
    return !!this.data?.alquiler;
  }
}