import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { KioskNotFoundComponent } from './pages/kiosk-not-found.component';
import { KioskAuthGuard } from './core/guards/kiosk-auth.guard';
import { KioskAuthComponent } from './pages/kiosk-auth/kiosk-auth.component';
import { KioskPlayerComponent } from './pages/kiosk-player/kiosk-player.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'player' },
  { path: 'auth', component: KioskAuthComponent },
  { path: 'player', component: KioskPlayerComponent, canActivate: [KioskAuthGuard] },
  { path: '**', component: KioskNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class KioskAppRoutingModule {}
