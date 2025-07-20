import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { HeaderComponent } from '../components/header/header.component';
import { MaisEsperadosComponent } from '../components/mais-esperados/mais-esperados.component';
import { EventosSecaoComponent } from '../components/eventos-secao/eventos-secao.component';
import { MunicipioOpcaoComponent } from '../components/municipio-opcao/municipio-opcao.component';
import { SharedModule } from '../shared/shared.module';


// home.module.ts
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    EventosSecaoComponent,
    MaisEsperadosComponent,
    SharedModule
  ],
  declarations: [MunicipioOpcaoComponent, HomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
