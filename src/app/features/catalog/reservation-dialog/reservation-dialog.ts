import { Component, input, output, model, effect, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservation-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation-dialog.html',
  styleUrls: ['./reservation-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationDialog {
  isOpen = model<boolean>(false);
  dressData = input<any>();
  purchaseType = input<'venta' | 'alquiler'>('alquiler'); // ✅ Nuevo
  
  onConfirm = output<any>();
  onCancel = output<void>();

  reservationForm: FormGroup;
  minDate = new Date().toISOString().split('T')[0];

  private isLocked = false;
  private scrollY = 0;

  // ✅ Textos dinámicos
  modalTitle = computed(() => {
    return this.purchaseType() === 'venta' ? 'Confirmar Compra' : 'Reservar Vestido';
  });

  confirmButtonText = computed(() => {
    return this.purchaseType() === 'venta' ? 'Confirmar Compra' : 'Confirmar Reserva';
  });

  constructor(private fb: FormBuilder) {
    this.reservationForm = this.fb.group({
      fechaInicio: this.fb.control('', { validators: [Validators.required], updateOn: 'change' }),
      fechaFin: this.fb.control('', { validators: [Validators.required], updateOn: 'change' }),
      nombre: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur' }),
      telefono: this.fb.control('', { validators: [Validators.required, Validators.pattern(/^[0-9]{9}$/)], updateOn: 'blur' }),
      email: this.fb.control('', { validators: [Validators.required, Validators.email], updateOn: 'blur' }),
      comentarios: this.fb.control('', { updateOn: 'change' })
    });

    effect((onCleanup) => {
      const open = this.isOpen();
      
      if (open && !this.isLocked) {
        requestAnimationFrame(() => {
          this.lockBody();
        });
      } else if (!open && this.isLocked) {
        requestAnimationFrame(() => {
          this.unlockBody();
        });
      }

      onCleanup(() => {
        if (this.isLocked) {
          this.unlockBody();
        }
      });
    });
  }

  private lockBody(): void {
    if (this.isLocked) return;
    
    this.scrollY = window.scrollY || window.pageYOffset || 0;
    
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflowY = 'scroll';
    
    this.isLocked = true;
  }

  private unlockBody(): void {
    if (!this.isLocked) return;
    
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflowY = '';
    
    window.scrollTo(0, this.scrollY);
    
    this.isLocked = false;
  }

  closeModal(): void {
    this.isOpen.set(false);
    this.reservationForm.reset();
    this.onCancel.emit();
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const reservationData = {
        ...this.reservationForm.value,
        vestidoId: this.dressData()?.id,
        vestidoNombre: this.dressData()?.name,
        precio: this.dressData()?.price,
        tipo: this.purchaseType()
      };
      this.onConfirm.emit(reservationData);
      this.closeModal();
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
}