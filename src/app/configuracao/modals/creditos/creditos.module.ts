import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CreditosComponent } from './creditos.component';

@NgModule({
  declarations: [CreditosComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [CreditosComponent] // 👈 se precisar usar fora
})
export class CreditosModule {}
