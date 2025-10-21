import { CommonModule , } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DressCard } from '../dress-card/dress-card';
import { CatalogStore } from '../catalog.store/catalog.store';

@Component({
  selector: 'app-catalog.page',
  imports: [CommonModule, FormsModule,DressCard],
  templateUrl:'./catalog.page.html',
  styleUrl: './catalog.page.scss'
})
export class CatalogPage {
  store = inject(CatalogStore);

}
