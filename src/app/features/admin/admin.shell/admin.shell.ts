import { Component, signal,ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin.shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin.shell.html',
  styleUrl: './admin.shell.scss',
  encapsulation: ViewEncapsulation.ShadowDom

})
export class AdminShell {
  menuOpen: boolean = false;
  
  unreadMessages = signal(3);
  unreadNotifications = signal(5);
  
  // ✅ Signals para controlar dropdowns
  showChatDropdown = signal(false);
  showHelpDropdown = signal(false);
  showNotificationsDropdown = signal(false);
  showUserDropdown = signal(false);

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  // ✅ Toggle dropdowns
  toggleChatDropdown(): void {
    this.showChatDropdown.set(!this.showChatDropdown());
    this.showHelpDropdown.set(false);
    this.showNotificationsDropdown.set(false);
    this.showUserDropdown.set(false);
  }

  toggleHelpDropdown(): void {
    this.showHelpDropdown.set(!this.showHelpDropdown());
    this.showChatDropdown.set(false);
    this.showNotificationsDropdown.set(false);
    this.showUserDropdown.set(false);
  }

  toggleNotificationsDropdown(): void {
    this.showNotificationsDropdown.set(!this.showNotificationsDropdown());
    this.showChatDropdown.set(false);
    this.showHelpDropdown.set(false);
    this.showUserDropdown.set(false);
  }

  toggleUserDropdown(): void {
    this.showUserDropdown.set(!this.showUserDropdown());
    this.showChatDropdown.set(false);
    this.showHelpDropdown.set(false);
    this.showNotificationsDropdown.set(false);
  }

  // ✅ Cerrar todos los dropdowns al hacer clic fuera
  closeAllDropdowns(): void {
    this.showChatDropdown.set(false);
    this.showHelpDropdown.set(false);
    this.showNotificationsDropdown.set(false);
    this.showUserDropdown.set(false);
  }

  // ✅ Navegación desde dropdowns
  goToProfile(): void {
    this.router.navigate(['/admin/perfil']);
    this.closeAllDropdowns();
  }

  goToSettings(): void {
    this.router.navigate(['/admin/ajustes']);
    this.closeAllDropdowns();
  }

  confirmLogout(event: Event): void {
    event.preventDefault();
    
    const confirmed = confirm('¿Estás seguro de que deseas cerrar sesión?');
    
    if (confirmed) {
      localStorage.removeItem('authToken');
      sessionStorage.clear();
      this.router.navigate(['/login']);
      console.log('Sesión cerrada');
    }
    this.closeAllDropdowns();
  }
}