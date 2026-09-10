import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from "./dashboard/dashboard.component";

const routes: Routes = [
  {
      path: "", component: DashboardComponent
  },
  {
    path: "dashboard", component: DashboardComponent
  },
  {
    path: 'customer-dashboard', loadChildren: () => import('./customer-dashboard/customer-dashboard.module').then(m => m.CustomerDashboardModule)
  },
  {
    path: 'agent-dashboard', loadChildren: () => import('./agent-dashboard/agent-dashboard.module').then(m => m.AgentDashboardModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardsRoutingModule { }
