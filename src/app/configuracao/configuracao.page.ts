import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/auth.service';

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

  constructor(
    private authService: AuthenticateService,
    private router: Router
  ) { }

  ngOnInit() { }

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
  editarPerfil() { console.log('Editar perfil'); }
  alterarSenha() { console.log('Alterar senha'); }
  gerenciarMetodosLogin() { console.log('Gerenciar métodos de login'); }
  verHistoricoCompras() { console.log('Ver histórico de compras'); }

  alterarIdioma() { console.log('Alterar idioma'); }
  alterarTema() { console.log('Alterar tema'); }
  alterarFormatoHora() { console.log('Alterar formato de hora'); }
  alterarExibicaoIngressos() { console.log('Alterar exibição de ingressos'); }

  gerenciarDispositivos() { console.log('Gerenciar dispositivos'); }
  verPoliticaPrivacidade() { console.log('Política de privacidade'); }
  exportarDados() { console.log('Exportar dados pessoais'); }

  abrirFAQ() { console.log('Abrir FAQ'); }
  enviarFeedback() { console.log('Enviar feedback'); }
  contatoSuporte() { console.log('Contato com suporte'); }

  verAtualizacoes() { console.log('Ver atualizações'); }
  verCreditos() { console.log('Ver créditos'); }
}
