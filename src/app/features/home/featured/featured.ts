import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-featured',
  imports: [RouterLink,CommonModule],
  templateUrl: './featured.html',
  styleUrl: './featured.scss'
})
export class Featured {

}
