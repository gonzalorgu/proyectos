import { Routes } from '@angular/router';
import { Shell } from './shared/layout/shell/shell';
import { HomePage } from './features/home/home.page/home.page';

import { CatalogPage } from './features/catalog/catalog.page/catalog.page';
import { DressDetail } from './features/catalog/dress-detail/dress-detail';
import { RentalsPage } from './features/rentals/rentals.page/rentals.page';
import { ProfilePage } from './features/profile/profile.page/profile.page';
import { LoginPage } from './features/auth/login.page/login.page';
import { RegisterPage } from './features/auth/register.page/register.page';
import { RecoverPage } from './features/auth/recover.page/recover.page';
import { AdminShell } from './features/admin/admin.shell/admin.shell';
import { Ajustes } from './features/admin/ajustes/ajustes';
import { VestidosPage } from './features/admin/vestidos/vestidos.page/vestidos.page';
import { Alquileres } from './features/admin/alquileres/alquileres';
import { Usuarios } from './features/admin/usuarios/usuarios';
import { Reportes } from './features/admin/reportes/reportes';
import { OverviewPage } from './features/admin/overview.page/overview.page';
import { Pagos } from './features/admin/pagos/pagos';
import { ReservationDialog } from './features/catalog/reservation-dialog/reservation-dialog';



export const routes: Routes = [

  {
    path: '',
    component: Shell,            // Shell debe tener <router-outlet>
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // default al iniciar
      { path: 'home', component: HomePage },
      { path: 'catalogo', component: CatalogPage },
      { path: 'vestido/:id', component: DressDetail },
      { path: 'mis-alquiler', component: RentalsPage },
      { path: 'perfil', component: ProfilePage },
      { path: 'login', component: LoginPage },
      { path: 'registro', component: RegisterPage },
      { path: 'recuperar', component: RecoverPage },
      { path: 'reservar', component: ReservationDialog },
    ],
  },
 
  {
    path: 'admin',
    component: AdminShell,
    children: [
      { path: '', pathMatch: 'full', component: OverviewPage }, 
      { path: 'inicio', component: OverviewPage },
      { path: 'ajustes', component: Ajustes },
      { path: 'vestidos', component: VestidosPage },
      { path: 'alquileres', component: Alquileres },
      { path: 'pagos', component: Pagos },
      { path: 'usuarios', component: Usuarios },
      { path: 'reportes', component: Reportes },
    ],
  },
  { path: '**', redirectTo: 'home' },
];





