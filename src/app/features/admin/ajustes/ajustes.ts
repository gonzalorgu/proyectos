import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-ajustes',
  imports: [CommonModule],
  templateUrl: './ajustes.html',
  styleUrls: ['./ajustes.scss']
})
export class Ajustes {
  nombre   = signal('Erma Zafe');
  correo   = signal('contacto@ermazafe.com');
  telefono = signal('999-111-222');
  msg      = signal<string | null>(null);

  guardar(){
    this.msg.set('Cambios guardados (demo)');
    setTimeout(() => this.msg.set(null), 1500);
  }
}