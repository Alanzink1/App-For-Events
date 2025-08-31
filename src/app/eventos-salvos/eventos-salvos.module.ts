import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventosSalvosPageRoutingModule } from './eventos-salvos-routing.module';

import { EventosSalvosPage } from './eventos-salvos.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventosSalvosPageRoutingModule,
    SharedModule
  ],
  declarations: [EventosSalvosPage]
})
export class EventosSalvosPageModule {}
