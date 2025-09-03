import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdicionarEventoComponent } from './adicionar-evento.component';

@NgModule({
  declarations: [AdicionarEventoComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule],
  exports: [AdicionarEventoComponent] // 👈 se precisar usar fora
})
export class AdicionarEventoModule {}
