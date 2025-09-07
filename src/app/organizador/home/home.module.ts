import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { AdicionarEventoComponent } from './modals/adicionar-evento/adicionar-evento.component';
import { AdicionarEventoModule } from './modals/adicionar-evento/adicionar-evento.module';
import { EditarEventoModule } from './modals/editar-evento/editar-evento.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdicionarEventoModule,
    EditarEventoModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
