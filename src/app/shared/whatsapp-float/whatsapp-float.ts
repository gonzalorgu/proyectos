import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-whatsapp-float',
  imports: [CommonModule],
  templateUrl: './whatsapp-float.html',
  styleUrl: './whatsapp-float.scss'
})
export class WhatsappFloat {
  @Input() phoneNumber: string = '51905028403';
  @Input() message: string = 'Hola, estoy interesado en sus vestidos';
  @Input() text: string = '¿Te ayudo?';

  get whatsappUrl(): string {
    const encodedMessage = encodeURIComponent(this.message);
    return `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
  }
}