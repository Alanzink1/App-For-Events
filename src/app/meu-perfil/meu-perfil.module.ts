import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeuPerfilPageRoutingModule } from './meu-perfil-routing.module';

import { MeuPerfilPage } from './meu-perfil.page';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeuPerfilPageRoutingModule,
    RouterModule,
    SharedModule
  ],
  declarations: [MeuPerfilPage]
})
export class MeuPerfilPageModule {}
