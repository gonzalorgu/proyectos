import { Component, Inject, OnInit, Optional, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

export interface ReservationData {
  dressId: number;
  dressName: string;
  dressPrice: number;
  purchaseType: 'venta' | 'alquiler';
}

@Component({
  selector: 'app-reservation-dialog',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation-dialog.html',
  styleUrls: ['./reservation-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationDialog implements OnInit {
  reservationForm!: FormGroup;
  minDate = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    @Optional() public dialogRef: DialogRef<any>,
    @Optional() @Inject(DIALOG_DATA) public data: ReservationData
  ) {}

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      comentarios: ['']
    });
  }

  get modalTitle(): string {
    return this.data?.purchaseType === 'venta' ? 'Confirmar Compra' : 'Reservar Vestido';
  }

  get confirmButtonText(): string {
    return this.data?.purchaseType === 'venta' ? 'Confirmar Compra' : 'Confirmar Reserva';
  }

  closeModal(): void {
    this.dialogRef?.close(undefined);
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const reservationData = {
        ...this.reservationForm.value,
        vestidoId: this.data?.dressId,
        vestidoNombre: this.data?.dressName,
        precio: this.data?.dressPrice,
        tipo: this.data?.purchaseType
      };
      this.dialogRef?.close(reservationData);
    } else {
      Object.keys(this.reservationForm.controls).forEach(key => {
        this.reservationForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.reservationForm.get(fieldName);
    if (control?.hasError('required')) return 'Este campo es obligatorio';
    if (control?.hasError('email')) return 'Ingresa un email válido';
    if (control?.hasError('pattern')) return 'Formato inválido (9 dígitos)';
    if (control?.hasError('minlength')) return 'Mínimo 3 caracteres';
    return '';
  }

  hasError(fieldName: string): boolean {
    const control = this.reservationForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  get f() {
    return this.reservationForm.controls;
  }
}