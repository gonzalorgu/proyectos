import { Component, OnInit, signal,ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ReporteAlquiler {
  mes: string;
  cantidad: number;
  ingresos: number;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Reportes implements OnInit {
  reporteMensual = signal<ReporteAlquiler[]>([]);
  vestidosPopulares = signal<{ nombre: string; alquileres: number }[]>([]);
  
  fechaGeneracion = new Date();
  totalAlquileres = 0;
  totalIngresos = 0;
  promedioAlquileres = 0;
  promedioIngresos = 0;

  ngOnInit(): void {
    this.cargarDatos();
    this.calcularTotales();
  }

  cargarDatos(): void {
    this.reporteMensual.set([
      { mes: 'Enero', cantidad: 7, ingresos: 1000 },
      { mes: 'Febrero', cantidad: 18, ingresos: 2500 },
      { mes: 'Marzo', cantidad: 22, ingresos: 3100 },
      { mes: 'Abril', cantidad: 20, ingresos: 2800 },
      { mes: 'Mayo', cantidad: 25, ingresos: 3500 },
      { mes: 'Junio', cantidad: 28, ingresos: 3900 },
      { mes: 'Julio', cantidad: 30, ingresos: 4200 },
      { mes: 'Agosto', cantidad: 27, ingresos: 3800 },
      { mes: 'Septiembre', cantidad: 24, ingresos: 3400 },
      { mes: 'Octubre', cantidad: 26, ingresos: 3700 }
    ]);

    this.vestidosPopulares.set([
      { nombre: 'Vestido de Noche Elegante', alquileres: 45 },
      { nombre: 'Vestido de Fiesta Rojo', alquileres: 38 },
      { nombre: 'Vestido de Boda', alquileres: 32 },
      { nombre: 'Vestido de Cóctel Negro', alquileres: 28 },
      { nombre: 'Vestido Casual Verano', alquileres: 25 }
    ]);
  }

  calcularTotales(): void {
    this.totalAlquileres = this.reporteMensual().reduce((sum, r) => sum + r.cantidad, 0);
    this.totalIngresos = this.reporteMensual().reduce((sum, r) => sum + r.ingresos, 0);
    this.promedioAlquileres = this.totalAlquileres / this.reporteMensual().length;
    this.promedioIngresos = this.totalIngresos / this.reporteMensual().length;
  }

  getMaxAlquileres(): number {
    return Math.max(...this.reporteMensual().map(r => r.cantidad));
  }

  getMaxIngresos(): number {
    return Math.max(...this.reporteMensual().map(r => r.ingresos));
  }

  getBarHeight(valor: number, max: number): string {
    return `${(valor / max) * 100}%`;
  }

  getMaxVestidos(): number {
    return Math.max(...this.vestidosPopulares().map(v => v.alquileres));
  }

  getTotalVestidosPopulares(): number {
    return this.vestidosPopulares().reduce((sum, v) => sum + v.alquileres, 0);
  }

  getPorcentajeVestidosPopulares(): string {
    const total = this.getTotalVestidosPopulares();
    return ((total / this.totalAlquileres) * 100).toFixed(1);
  }

  imprimirReporte(): void {
    window.print();
  }
}