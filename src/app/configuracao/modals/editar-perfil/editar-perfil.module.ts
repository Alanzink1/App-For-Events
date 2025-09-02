import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EditarPerfilComponent } from './editar-perfil.component';

@NgModule({
  declarations: [EditarPerfilComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [EditarPerfilComponent] // 👈 se precisar usar fora
})
export class EditarPerfilModule {}
