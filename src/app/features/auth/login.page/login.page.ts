import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../servicios/auth.service/auth.service.js';

@Component({
  selector: 'app-login.page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  email = signal('');
  pass = signal('');
  error = signal<string | null>(null);
  loading = signal(false);
  showPassword = signal(false);

  // ✅ Usuarios de prueba
  private readonly TEST_USERS = [
    {
      email: 'admin@ermazafe.com',
      password: '123456',
      name: 'María González',
      role: 'user' // Usuario normal
    },
    {
      email: 'dashboard@ermazafe.com',
      password: 'admin123',
      name: 'Admin Dashboard',
      role: 'admin' // Usuario administrador
    }
  ];

  onEmail(e: Event) { 
    this.email.set((e.target as HTMLInputElement).value.trim()); 
  }

  onPass(e: Event) { 
    this.pass.set((e.target as HTMLInputElement).value); 
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  submit() {
    this.error.set(null);

    if (!this.email() || !this.pass()) { 
      this.error.set('Completa correo y contraseña'); 
      return; 
    }

    this.loading.set(true);

    setTimeout(() => {
      // ✅ Buscar usuario en el array
      const user = this.TEST_USERS.find(
        u => u.email === this.email() && u.password === this.pass()
      );

      if (user) {
        // ✅ Login exitoso
        this.authService.login(user.name);
        
        // ✅ Redirigir según el rol
        if (user.role === 'admin') {
          this.router.navigate(['/admin/inicio']); // Dashboard admin
        } else {
          this.router.navigate(['/home']); // Home normal
        }
      } else {
        // ❌ Credenciales incorrectas
        this.error.set('Correo o contraseña incorrectos');
        this.loading.set(false);
      }
    }, 800);
  }
}