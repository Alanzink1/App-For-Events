import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IngressoPageRoutingModule } from './ingresso-routing.module';

import { IngressoPage } from './ingresso.page';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngressoPageRoutingModule,
    SharedModule,
    RouterModule,
    QRCodeModule
  ],
  declarations: [IngressoPage]
})
export class IngressoPageModule {}
