import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  telefono?: string;
  activo: boolean;
  rol?: 'admin' | 'cliente';
  fechaRegistro?: Date;
}

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.form.html',
  styleUrls: ['./usuarios.form.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsuariosForm implements OnInit {
  usuarioForm!: FormGroup;

  roles = [
    { value: 'cliente', label: 'Cliente' },
    { value: 'admin', label: 'Administrador' }
  ];

  constructor(
    private fb: FormBuilder,
    @Optional() public dialogRef: DialogRef<Usuario | undefined>,  // ← CAMBIO AQUÍ
    @Optional() @Inject(DIALOG_DATA) public data: { usuario: Usuario | null }
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.data?.usuario) {
      this.usuarioForm.patchValue(this.data.usuario);
    }
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      rol: ['cliente', Validators.required],
      activo: [true]
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      this.dialogRef?.close(this.usuarioForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef?.close(undefined);  // ← CAMBIO: null por undefined
  }

  get f() {
    return this.usuarioForm.controls;
  }

  get isEditMode(): boolean {
    return !!this.data?.usuario;
  }
}