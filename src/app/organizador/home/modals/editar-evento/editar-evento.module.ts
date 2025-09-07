import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditarEventoComponent } from './editar-evento.component';

@NgModule({
  declarations: [EditarEventoComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule],
  exports: [EditarEventoComponent] // 👈 se precisar usar fora
})
export class EditarEventoModule {}
