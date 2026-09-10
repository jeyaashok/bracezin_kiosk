import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { BasicComponent } from "./basic/basic.component";
import { CoverComponent } from "./cover/cover.component";

const routes: Routes = [
  {
    path: '',
    component: CoverComponent
  },
  {
    path: 'basic',
    component: BasicComponent
  },
  {
    path: 'cover',
    component: CoverComponent
  },
  {
    path: '**',
    redirectTo: 'cover'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SigninRoutingModule { }
