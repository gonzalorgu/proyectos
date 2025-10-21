import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header,  } from '../header/header';
import { Footer } from '../footer/footer';
import { WhatsappFloat } from "../../whatsapp-float/whatsapp-float";

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Footer, WhatsappFloat],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {

}
