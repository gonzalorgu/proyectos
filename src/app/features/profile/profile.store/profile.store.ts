// src/app/features/profile/profile.store.ts
import { Injectable, signal } from '@angular/core';

export type TallaPref = 'S' | 'M' | 'L' | 'XL';

export interface UserProfile {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  documento: string; // DNI / Doc
  tallaPref: TallaPref | null;
  avatarUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProfileStore {
  // mock inicial
  profile = signal<UserProfile>({
    nombre: 'Erma',
    apellidos: 'Zafe',
    email: 'cliente@ejemplo.com',
    telefono: '+51 900 000 000',
    documento: 'DNI 00000000',
    tallaPref: null,
    avatarUrl: null,
  });

  // acciones (Signals)
  setCampo<K extends keyof UserProfile>(k: K, v: UserProfile[K]) {
    this.profile.update(p => ({ ...p, [k]: v }));
  }
  setTallaPref(v: TallaPref | null) { this.setCampo('tallaPref', v); }
  setAvatar(url: string | null) { this.setCampo('avatarUrl', url); }

  // simulaciones (frontend)
  guardarCambios() { alert('Datos guardados (demo)'); }
  actualizarPassword(_actual: string, nueva: string, repetir: string) {
    if (!nueva || nueva !== repetir) { alert('Las contraseñas no coinciden'); return; }
    alert('Contraseña actualizada (demo)');
  }
}
