import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register.page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss'
})
export class RegisterPage {
  nombre  = signal('');
  email   = signal('');
  pass    = signal('');
  confirm = signal('');
  error   = signal<string | null>(null);
  loading = signal(false);
  
  // ✅ Signals para mostrar/ocultar contraseñas
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  onNombre(e: Event){ this.nombre.set((e.target as HTMLInputElement).value); }
  onEmail(e: Event){ this.email.set((e.target as HTMLInputElement).value.trim()); }
  onPass(e: Event){ this.pass.set((e.target as HTMLInputElement).value); }
  onConfirm(e: Event){ this.confirm.set((e.target as HTMLInputElement).value); }

  // ✅ Toggle para contraseña
  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  // ✅ Toggle para confirmar contraseña
  toggleConfirmPassword() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  submit(){
    this.error.set(null);

    if (!this.nombre().trim()) { this.error.set('Ingresa tu nombre completo'); return; }
    if (!this.email().trim())  { this.error.set('Ingresa tu correo'); return; }
    if (!this.pass())          { this.error.set('Ingresa una contraseña'); return; }
    if (this.pass().length < 6){ this.error.set('La contraseña debe tener al menos 6 caracteres'); return; }
    if (this.pass() !== this.confirm()){ this.error.set('Las contraseñas no coinciden'); return; }

    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      alert(`Registro (demo)
Nombre: ${this.nombre()}
Email: ${this.email()}`);
    }, 700);
  }
}