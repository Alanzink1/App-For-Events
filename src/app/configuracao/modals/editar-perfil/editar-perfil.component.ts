import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss'],
})
export class EditarPerfilComponent {
  @Input() nome: string = '';
  @Input() email: string = '';
  @Input() telefone: string = '';

  constructor(private modalCtrl: ModalController) {}

  fechar() {
    this.modalCtrl.dismiss();
  }

  salvar() {
    // Aqui você pode chamar seu serviço para salvar os dados
    console.log('Salvando:', this.nome, this.email, this.telefone);
    this.modalCtrl.dismiss({ nome: this.nome, email: this.email, telefone: this.telefone });
  }
}
