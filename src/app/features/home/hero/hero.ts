import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [CommonModule,RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {

}
