import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  senha = '';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async login() {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.email, this.senha);
      const uid = userCredential.user?.uid;

      // Salva no localStorage ou envia o ID para a próxima rota
      localStorage.setItem('uid', uid || '');
      this.router.navigate(['/meu-perfil']);
    } catch (error: any) {
      const alert = await this.alertCtrl.create({
        header: 'Erro',
        message: 'Email ou senha incorretos.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async esqueciSenha() {
    if (!this.email) return;

    try {
      await this.afAuth.sendPasswordResetEmail(this.email);
      const alert = await this.alertCtrl.create({
        header: 'Email enviado',
        message: 'Verifique sua caixa de entrada.',
        buttons: ['OK'],
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Erro',
        message: 'Não foi possível enviar o email.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
