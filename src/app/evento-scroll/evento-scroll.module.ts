import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventoScrollPageRoutingModule } from './evento-scroll-routing.module';

import { EventoScrollPage } from './evento-scroll.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventoScrollPageRoutingModule
  ],
  declarations: [EventoScrollPage]
})
export class EventoScrollPageModule {}
