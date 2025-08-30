import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngressoPage } from './ingresso.page';

const routes: Routes = [
  {
    path: '',
    component: IngressoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngressoPageRoutingModule {}
