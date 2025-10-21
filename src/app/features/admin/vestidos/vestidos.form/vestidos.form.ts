import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Vestido } from '../vestidos.store/vestidos.store';

@Component({
  selector: 'app-vestidos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vestidos.form.html',
  styleUrls: ['./vestidos.form.scss']
})
export class VestidosForm implements OnInit, OnDestroy {
  @Input() vestido?: Vestido;
  @Output() submitForm = new EventEmitter<Partial<Vestido>>();
  @Output() cancelForm = new EventEmitter<void>();

  vestidoForm!: FormGroup;
  
  tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  categorias = ['Casual', 'Formal', 'Fiesta', 'Cóctel', 'Novia'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    if (this.vestido) {
      this.vestidoForm.patchValue(this.vestido);
    }
    // Bloquea el scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // Restaura el scroll cuando se destruye el componente
    document.body.style.overflow = '';
  }

  initForm(): void {
    this.vestidoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      talla: ['', Validators.required],
      color: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      descripcion: [''],
      imagen: [''],
      disponible: [true],
      categoria: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.vestidoForm.valid) {
      const formData = this.vestidoForm.value;
      if (this.vestido) {
        formData.id = this.vestido.id;
      }
      
      // Cierra con animación antes de enviar
      this.closeModal(() => {
        this.submitForm.emit(formData);
        if (!this.vestido) {
          this.vestidoForm.reset({ disponible: true });
        }
      });
    }
  }

  onCancel(): void {
    this.closeModal(() => {
      this.vestidoForm.reset({ disponible: true });
      this.cancelForm.emit();
    });
  }

  /**
   * Cierra el modal con animación suave y rápida
   * @param callback Función a ejecutar después de la animación de cierre
   */
  private closeModal(callback: () => void): void {
    const container = document.querySelector('.vestido-form-container');
    
    if (container) {
      // Añade la clase que activa la animación de cierre (zoomOut)
      container.classList.add('closing');
      
      // Espera 200ms (duración de la animación zoomOut) antes de ejecutar el callback
      setTimeout(() => {
        // Restaura el scroll del body
        document.body.style.overflow = '';
        // Ejecuta la función callback (emit de eventos)
        callback();
      }, 200); // Reducido de 250ms a 200ms para mayor velocidad
    } else {
      // Si no encuentra el contenedor, restaura scroll y ejecuta callback inmediatamente
      document.body.style.overflow = '';
      callback();
    }
  }

  /**
   * Getter para acceder fácilmente a los controles del formulario en el template
   * Uso: f['nombre'].invalid
   */
  get f() {
    return this.vestidoForm.controls;
  }
}