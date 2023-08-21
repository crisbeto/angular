import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



import { DashboardComponent } from './dashboard.component';
import { DashboardHeroComponent } from './dashboard-hero.component';

const routes: Routes =  [
  { path: 'dashboard',  component: DashboardComponent },
];

@NgModule({
    imports: [
    RouterModule.forChild(routes),
    DashboardComponent, DashboardHeroComponent
]
})
export class DashboardModule { }
