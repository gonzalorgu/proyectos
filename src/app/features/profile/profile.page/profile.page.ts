import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileStore, TallaPref } from '../profile.store/profile.store';

@Component({
  selector: 'app-profile.page',
  imports: [CommonModule],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss'
})
export class ProfilePage {
  store = inject(ProfileStore);

  readonly tallas: ReadonlyArray<TallaPref> = ['S', 'M', 'L', 'XL'] as const;

  passActual = signal('');
  passNueva = signal('');
  passRepite = signal('');

  onNombre(e: Event) {
    this.store.setCampo('nombre', (e.target as HTMLInputElement).value);
  }

  onApellidos(e: Event) {
    this.store.setCampo('apellidos', (e.target as HTMLInputElement).value);
  }

  onEmail(e: Event) {
    this.store.setCampo('email', (e.target as HTMLInputElement).value);
  }

  onTelefono(e: Event) {
    this.store.setCampo('telefono', (e.target as HTMLInputElement).value);
  }

  onDocumento(e: Event) {
    this.store.setCampo('documento', (e.target as HTMLInputElement).value);
  }

  onTalla(t: TallaPref) {
    this.store.setTallaPref(t);
  }

  onPassActual(e: Event) {
    this.passActual.set((e.target as HTMLInputElement).value);
  }

  onPassNueva(e: Event) {
    this.passNueva.set((e.target as HTMLInputElement).value);
  }

  onPassRepite(e: Event) {
    this.passRepite.set((e.target as HTMLInputElement).value);
  }

  onPickAvatar(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const fr = new FileReader();
    fr.onload = () => this.store.setAvatar(String(fr.result));
    fr.readAsDataURL(file);
  }

  limpiarAvatar() {
    this.store.setAvatar(null);
  }

  guardarDatos() {
    this.store.guardarCambios();
  }

  guardarPassword() {
    this.store.actualizarPassword(this.passActual(), this.passNueva(), this.passRepite());
    this.passActual.set('');
    this.passNueva.set('');
    this.passRepite.set('');
  }
}