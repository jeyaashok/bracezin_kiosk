import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from "./list/list.component";
import { FormComponent } from "./form/form.component";
import { ItemComponent } from "./item/item.component";
import { CustomerService } from 'src/@bracezin/_dbShare';

const routes: Routes = [
		{
			path: 'list', component: ListComponent
		},
		{
		  path: ':id',
		  component: ItemComponent,
		  // resolve: { customer: CustomerService },
		  // data: { method: 'item', resolveData: {'with': 'addresses'} }
		},
		{
			path: 'add', component: FormComponent
		},
		{
			path: 'edit/:id', component: FormComponent
		},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class CustomerRoutingModule { }
