import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/auth.service'; // Importe seu serviço de autenticação

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.page.html',
  styleUrls: ['./configuracao.page.scss'],
})
export class ConfiguracaoPage implements OnInit {

  // 1. Injete o AuthService e o Router
  constructor(
    private authService: AuthenticateService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  // 2. Crie a função de logout
  async logout() {
    try {
      await this.authService.logout();
      // 3. Redirecione o usuário para a página de login após o logout
      this.router.navigate(['/login']);
      console.log('Usuário deslogado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

}