import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'system-setting', loadChildren: () => import('./system-setting/system-setting.module').then(m => m.SystemSettingModule)
  },
  {
    path: 'financial-year', loadChildren: () => import('./financial-year/financial-year.module').then(m => m.FinancialYearModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AccountRoutingModule { }
