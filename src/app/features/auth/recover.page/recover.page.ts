import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recover.page',
  imports: [CommonModule, RouterLink],
  templateUrl: './recover.page.html',
  styleUrl: './recover.page.scss'
})
export class RecoverPage {
  step    = signal<'email' | 'code' | 'reset'>('email');
  loading = signal(false);
  error   = signal<string | null>(null);
  info    = signal<string | null>(null);

  email   = signal('');
  code    = signal('');
  pass    = signal('');
  confirm = signal('');

  onEmail(e: Event)   { this.email.set((e.target as HTMLInputElement).value.trim()); }
  onCode(e: Event)    { this.code.set((e.target as HTMLInputElement).value.trim()); }
  onPass(e: Event)    { this.pass.set((e.target as HTMLInputElement).value); }
  onConfirm(e: Event) { this.confirm.set((e.target as HTMLInputElement).value); }

  sendCode() {
    this.error.set(null); this.info.set(null);
    if (!this.email()) { this.error.set('Ingresa tu correo'); return; }
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.info.set('Te enviamos un código al correo (demo).');
      this.step.set('code');
    }, 600);
  }

  verifyCode() {
    this.error.set(null); this.info.set(null);
    if (!this.code()) { this.error.set('Ingresa el código que te enviamos'); return; }
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.step.set('reset');
    }, 600);
  }

  resetPassword() {
    this.error.set(null); this.info.set(null);
    if (!this.pass()) { this.error.set('Ingresa una nueva contraseña'); return; }
    if (this.pass().length < 6) { this.error.set('La contraseña debe tener al menos 6 caracteres'); return; }
    if (this.pass() !== this.confirm()) { this.error.set('Las contraseñas no coinciden'); return; }

    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      alert('Contraseña actualizada (demo). Ahora puedes iniciar sesión.');
    }, 700);
  }

  backToEmail() {
    this.step.set('email');
    this.error.set(null); this.info.set(null);
    this.code.set('');
  }

  backToCode() {
    this.step.set('code');
    this.error.set(null); this.info.set(null);
    this.pass.set(''); this.confirm.set('');
  }
}