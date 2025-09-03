import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/auth.service';
import { ModalController } from '@ionic/angular';
import { EditarPerfilComponent } from './modals/editar-perfil/editar-perfil.component';
import { ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { AlterarSenhaComponent } from './modals/alterar-senha/alterar-senha.component';
import { CreditosComponent } from './modals/creditos/creditos.component';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.page.html',
  styleUrls: ['./configuracao.page.scss'],
})
export class ConfiguracaoPage implements OnInit {
  // Toggles das notificações e biometria
  alertasEventos: boolean = true;
  promocoesOfertas: boolean = true;
  resumoSemanal: boolean = true;
  ativarBiometria: boolean = false;
  temaSelecionado: string = '';
  @ViewChild('idiomaSelect', { static: false }) idiomaSelect!: IonSelect;
  @ViewChild('temaSelect', { static: false }) temaSelect!: IonSelect;
  usarBiometria = false;

  constructor(
    private authService: AuthenticateService,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    const temaSalvo = localStorage.getItem('tema');
    this.usarBiometria = await this.authService.biometriaAtiva();
    if (temaSalvo) {
      this.temaSelecionado = temaSalvo;
      this.alterarTema();
    }
  }

  

  // Logout
  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
      console.log('Usuário deslogado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  // Funções placeholders para navegação/ações
  async editarPerfil() {
    const modal = await this.modalCtrl.create({
      component: EditarPerfilComponent,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('Dados atualizados:', data); // aqui você pode atualizar localmente a UI
    }
  }

  async alterarSenha() {
    const modal = await this.modalCtrl.create({
      component: AlterarSenhaComponent,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('Dados atualizados:', data); // aqui você pode atualizar localmente a UI
    }
  }

  gerenciarMetodosLogin() { console.log('Gerenciar métodos de login'); }
  verHistoricoCompras() { console.log('Ver histórico de compras'); }

  alterarIdioma() {
    this.idiomaSelect.open();
  }

  alterarTema() {
    this.temaSelect.open();
    localStorage.setItem('tema', this.temaSelecionado);
  }

  alterarFormatoHora() { console.log('Alterar formato de hora'); }
  alterarExibicaoIngressos() { console.log('Alterar exibição de ingressos'); }

  async toggleBiometria() {
    if (this.usarBiometria) {
      await this.authService.ativarBiometria();
    } else {
      await this.authService.desativarBiometria();
    }
  }

  gerenciarDispositivos() { console.log('Gerenciar dispositivos'); }
  verPoliticaPrivacidade() { console.log('Política de privacidade'); }
  exportarDados() { console.log('Exportar dados pessoais'); }

  abrirFAQ() { console.log('Abrir FAQ'); }
  enviarFeedback() { console.log('Enviar feedback'); }
  contatoSuporte() { console.log('Contato com suporte'); }

  verAtualizacoes() { console.log('Ver atualizações'); }
  async verCreditos() {
    const modal = await this.modalCtrl.create({
      component: CreditosComponent,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('Dados atualizados:', data); // aqui você pode atualizar localmente a UI
    }
  }
}
