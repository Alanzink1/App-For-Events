import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventosSalvosPage } from './eventos-salvos.page';

const routes: Routes = [
  {
    path: '',
    component: EventosSalvosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventosSalvosPageRoutingModule {}
