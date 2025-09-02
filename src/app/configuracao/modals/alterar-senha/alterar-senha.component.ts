import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Auth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, User } from '@angular/fire/auth';
import { MessageService } from 'src/app/services/message.service'; // seu service de mensagens

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.scss'],
})
export class AlterarSenhaComponent {
  senhaAntiga: string = '';
  novaSenha: string = '';

  constructor(
    private modalCtrl: ModalController,
    private auth: Auth,
    private _message: MessageService
  ) {}

  async salvar() {
    const user: User | null = this.auth.currentUser;

    if (!user) {
      this._message.show('Usuário não autenticado!');
      return;
    }

    try {
      // 1️⃣ Reautenticar o usuário com a senha antiga
      const credential = EmailAuthProvider.credential(user.email!, this.senhaAntiga);
      await reauthenticateWithCredential(user, credential);

      // 2️⃣ Atualizar para a nova senha
      await updatePassword(user, this.novaSenha);

      this._message.show('Senha alterada com sucesso!');
      this.modalCtrl.dismiss();
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/wrong-password') {
        this._message.show('Senha antiga incorreta.');
      } else if (error.code === 'auth/weak-password') {
        this._message.show('A nova senha é muito fraca.');
      } else {
        this._message.show('Erro ao alterar a senha.');
      }
    }
  }

  fechar() {
    this.modalCtrl.dismiss();
  }
}
