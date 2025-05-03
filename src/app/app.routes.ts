import { Routes } from '@angular/router';
import { OverviewComponent } from './pages/overview/overview.component';
import { ResultComponent } from './pages/result/result.component';

export const routes: Routes = [

  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent },
  { path: 'result/:id', component: ResultComponent },
  { path: '**', redirectTo: 'overview' }
];