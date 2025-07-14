import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventoScrollPage } from './evento-scroll.page';

const routes: Routes = [
  {
    path: '',
    component: EventoScrollPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventoScrollPageRoutingModule {}
