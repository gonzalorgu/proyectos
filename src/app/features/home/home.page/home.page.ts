import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { Featured } from "../featured/featured";
import { Cta } from "../cta/cta";


@Component({
  selector: 'app-home.page',
  imports: [CommonModule, Hero, Featured, Cta],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
  
})
export class HomePage {
  year = new Date().getFullYear();

}
