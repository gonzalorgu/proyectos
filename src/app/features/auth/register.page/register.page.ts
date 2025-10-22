import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../servicios/auth.service/auth.service';

@Component({
  selector: 'app-register.page',
  imports: [RouterLink],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss'
})
export class RegisterPage {
  private router = inject(Router);
  private authService = inject(AuthService);

  nombre = signal('');
  email = signal('');
  pass = signal('');
  confirm = signal('');
  error = signal<string | null>(null);
  loading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  onNombre(e: Event) {
    this.nombre.set((e.target as HTMLInputElement).value.trim());
  }

  onEmail(e: Event) {
    this.email.set((e.target as HTMLInputElement).value.trim());
  }

  onPass(e: Event) {
    this.pass.set((e.target as HTMLInputElement).value);
  }

  onConfirm(e: Event) {
    this.confirm.set((e.target as HTMLInputElement).value);
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update(v => !v);
  }

  submit() {
    this.error.set(null);

    if (!this.nombre() || !this.email() || !this.pass() || !this.confirm()) {
      this.error.set('Completa todos los campos');
      return;
    }

    if (this.pass().length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.pass() !== this.confirm()) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);

    setTimeout(() => {
      this.authService.login(this.nombre());
      this.router.navigate(['/home']);
    }, 800);
  }
}