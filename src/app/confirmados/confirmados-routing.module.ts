import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmadosPage } from './confirmados.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmadosPageRoutingModule {}
