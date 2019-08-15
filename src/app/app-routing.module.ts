import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, /* redirect, направляет по умолчанию на путь '/dashboard' */
  { path: 'dashboard', component: DashboardComponent }, /* simple */
  { path: 'heroes', component: HeroesComponent }, /* simple */
  { path: 'detail/:id', component: HeroDetailComponent } /* путь с параметром */
];

@NgModule({
  /* эти 2 строчки обеспечивают настройку роутера через наши маршруты и применение его ко всему приложению */
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
