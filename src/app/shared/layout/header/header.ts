import { Component, signal, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../servicios/auth.service/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  scrolled = signal(false);
  showUserMenu = signal(false);

  isLoggedIn = this.authService.isLoggedIn;
  userName = this.authService.userName;

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 80);
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
  }

  closeUserMenu() {
    this.showUserMenu.set(false);
  }

  logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      this.showUserMenu.set(false);
      this.router.navigate(['/login']);
    }
  }
}