import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Vestido } from '../vestidos.store/vestidos.store';

@Component({
  selector: 'app-vestidos-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vestidos.form.html',
  styleUrls: ['./vestidos.form.scss']
})
export class VestidosForm implements OnInit {
  vestidoForm!: FormGroup;
  
  tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  categorias = ['Casual', 'Formal', 'Fiesta', 'Cóctel', 'Novia'];

  constructor(
    private fb: FormBuilder,
    @Optional() public dialogRef: DialogRef<Partial<Vestido> | undefined>,
    @Optional() @Inject(DIALOG_DATA) public data: { vestido: Vestido | null }
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.data?.vestido) {
      this.vestidoForm.patchValue(this.data.vestido);
    }
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
      if (this.data?.vestido) {
        formData.id = this.data.vestido.id;
      }
      this.dialogRef?.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef?.close(undefined);
  }

  get f() {
    return this.vestidoForm.controls;
  }

  get isEditMode(): boolean {
    return !!this.data?.vestido;
  }
}