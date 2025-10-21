import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  
  // ✅ Signals compartidos entre componentes
  isLoggedIn = signal(false);
  userName = signal('Usuario');

  constructor() {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      const userName = localStorage.getItem('userName');
      
      if (token) {
        this.isLoggedIn.set(true);
        this.userName.set(userName || 'Usuario');
      } else {
        this.isLoggedIn.set(false);
      }
    }
  }

  login(name: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', 'demo-token-12345');
      localStorage.setItem('userName', name);
      this.isLoggedIn.set(true);
      this.userName.set(name);
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      this.isLoggedIn.set(false);
      this.userName.set('Usuario');
    }
  }
}