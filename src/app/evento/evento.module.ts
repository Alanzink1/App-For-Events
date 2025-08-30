import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventoPageRoutingModule } from './evento-routing.module';

import { EventoPage } from './evento.page';

import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { RouterModule } from '@angular/router';
import { SuccessModalComponent } from '../components/success-modal/success-modal.component';

// 2. FUNÇÃO PARA O PLAYER
export function playerFactory() {
  return player;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventoPageRoutingModule,
    RouterModule,
    LottieModule.forRoot({ player: playerFactory }),
    SuccessModalComponent
  ],
  declarations: [EventoPage]
})
export class EventoPageModule {}
