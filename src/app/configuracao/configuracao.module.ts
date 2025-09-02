import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfiguracaoPageRoutingModule } from './configuracao-routing.module';

import { ConfiguracaoPage } from './configuracao.page';
import { SharedModule } from '../shared/shared.module';
import { EditarPerfilModule } from './modals/editar-perfil/editar-perfil.module';
import { AlterarSenhaModule } from './modals/alterar-senha/alterar-senha.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    FormsModule,
    EditarPerfilModule,
    AlterarSenhaModule,
    ConfiguracaoPageRoutingModule
  ],
  declarations: [ConfiguracaoPage]
})
export class ConfiguracaoPageModule {}
