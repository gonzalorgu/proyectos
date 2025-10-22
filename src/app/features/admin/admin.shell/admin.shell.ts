import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin.shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin.shell.html',
  styleUrl: './admin.shell.scss'
})
export class AdminShell {
  menuOpen = false;
  
  unreadMessages = signal(3);
  unreadNotifications = signal(5);
  
  showChatDropdown = signal(false);
  showHelpDropdown = signal(false);
  showNotificationsDropdown = signal(false);
  showUserDropdown = signal(false);

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleChatDropdown(): void {
    this.showChatDropdown.update(v => !v);
    this.showHelpDropdown.set(false);
    this.showNotificationsDropdown.set(false);
    this.showUserDropdown.set(false);
  }

  toggleHelpDropdown(): void {
    this.showHelpDropdown.update(v => !v);
    this.showChatDropdown.set(false);
    this.showNotificationsDropdown.set(false);
    this.showUserDropdown.set(false);
  }

  toggleNotificationsDropdown(): void {
    this.showNotificationsDropdown.update(v => !v);
    this.showChatDropdown.set(false);
    this.showHelpDropdown.set(false);
    this.showUserDropdown.set(false);
  }

  toggleUserDropdown(): void {
    this.showUserDropdown.update(v => !v);
    this.showChatDropdown.set(false);
    this.showHelpDropdown.set(false);
    this.showNotificationsDropdown.set(false);
  }

  closeAllDropdowns(): void {
    this.showChatDropdown.set(false);
    this.showHelpDropdown.set(false);
    this.showNotificationsDropdown.set(false);
    this.showUserDropdown.set(false);
  }

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
    
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('authToken');
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }
    this.closeAllDropdowns();
  }
}