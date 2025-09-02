import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AlterarSenhaComponent } from './alterar-senha.component';

@NgModule({
  declarations: [AlterarSenhaComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [AlterarSenhaComponent] // 👈 se precisar usar fora
})
export class AlterarSenhaModule {}
