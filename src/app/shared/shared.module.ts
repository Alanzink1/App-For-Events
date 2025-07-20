// shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

// Componentes compartilhados
import { NavbarComponent } from '../components/navbar/navbar.component';
import { HeaderComponent } from '../components/header/header.component';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [NavbarComponent, HeaderComponent],
  imports: [CommonModule, IonicModule, RouterLink],
  exports: [NavbarComponent, HeaderComponent]
})
export class SharedModule {}
