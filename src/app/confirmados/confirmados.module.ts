import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular';

import { ConfirmadosPageRoutingModule } from './confirmados-routing.module';

import { ConfirmadosPage } from './confirmados.page';
import { SharedModule } from '../shared/shared.module';
import { RouterLink, RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmadosPageRoutingModule,
    SharedModule,
    RouterModule
  ],
  declarations: [ConfirmadosPage]
})
export class ConfirmadosPageModule {}
