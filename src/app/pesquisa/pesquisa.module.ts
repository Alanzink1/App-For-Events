import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PesquisaPageRoutingModule } from './pesquisa-routing.module';

import { PesquisaPage } from './pesquisa.page';
import { HeaderComponent } from '../components/header/header.component';
import { SearchbarComponent } from '../components/searchbar/searchbar.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    IonicModule,
    PesquisaPageRoutingModule,
    SearchbarComponent,
    SharedModule
  ],
  declarations: [PesquisaPage]
})
export class PesquisaPageModule {}
