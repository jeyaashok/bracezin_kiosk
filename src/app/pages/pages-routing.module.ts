import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
      path: '', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
    },
    {
      path: 'contact', loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
    },
    {
      path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
    },
    {
      path: 'security', loadChildren: () => import('./account/security/security.module').then(m => m.SecurityModule)
    },
    {
      path: 'tools', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
