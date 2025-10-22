import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.html',
  styleUrls: ['./ajustes.scss']
})
export class Ajustes {
  nombre = signal('Erma Zafe');
  correo = signal('contacto@ermazafe.com');
  telefono = signal('999-111-222');
  msg = signal<string | null>(null);

  onNombre(e: Event) {
    this.nombre.set((e.target as HTMLInputElement).value);
  }

  onCorreo(e: Event) {
    this.correo.set((e.target as HTMLInputElement).value);
  }

  onTelefono(e: Event) {
    this.telefono.set((e.target as HTMLInputElement).value);
  }

  guardar() {
    this.msg.set('Cambios guardados (demo)');
    setTimeout(() => this.msg.set(null), 1500);
  }
}