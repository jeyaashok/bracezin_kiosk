import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
	},
	{
		path: 'agent', loadChildren: () => import('./agent/agent.module').then(m => m.AgentModule)
	},
	{
		path: 'staff', loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule)
	},
	{
		path: 'company', loadChildren: () => import('./company/company.module').then(m => m.CompanyModule)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class ContactRoutingModule { }
