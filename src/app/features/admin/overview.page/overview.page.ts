import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type Stat = { label: string; value: string; hint: string };
type Row = { id: string; cliente: string; fecha: string; estado: 'Activo' | 'Pendiente' | 'Devuelto' };

@Component({
  selector: 'app-overview.page',
  imports: [RouterLink],
  templateUrl: './overview.page.html',
  styleUrl: './overview.page.scss'
})
export class OverviewPage {
  stats = signal<Stat[]>([
    { label: 'Alquileres activos', value: '12', hint: '+3 hoy' },
    { label: 'Vestidos en stock', value: '148', hint: '5 reservados' },
    { label: 'Usuarios', value: '892', hint: '+12 esta semana' },
    { label: 'Ingresos (mes)', value: 'S/7540', hint: '↑ 12%' }
  ]);

  recientes = signal<Row[]>([
    { id: 'R-1043', cliente: 'Ana Torres', fecha: '13/10/2025', estado: 'Activo' },
    { id: 'R-1042', cliente: 'María López', fecha: '12/10/2025', estado: 'Devuelto' },
    { id: 'R-1041', cliente: 'Julia Vega', fecha: '12/10/2025', estado: 'Pendiente' },
    { id: 'R-1040', cliente: 'Karla Díaz', fecha: '11/10/2025', estado: 'Activo' }
  ]);
}