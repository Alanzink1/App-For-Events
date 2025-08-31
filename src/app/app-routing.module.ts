import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'pesquisa',
    loadChildren: () => import('./pesquisa/pesquisa.module').then( m => m.PesquisaPageModule)
  },
  {
    path: 'confirmados',
    loadChildren: () => import('./confirmados/confirmados.module').then( m => m.ConfirmadosPageModule)
  },
  {
    path: 'meu-perfil',
    loadChildren: () => import('./meu-perfil/meu-perfil.module').then( m => m.MeuPerfilPageModule)
  },
  {
    path: 'evento/:id',
    loadChildren: () => import('./evento/evento.module').then( m => m.EventoPageModule)
  },
  {
    path: 'evento-scroll',
    loadChildren: () => import('./evento-scroll/evento-scroll.module').then( m => m.EventoScrollPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'configuracao',
    loadChildren: () => import('./configuracao/configuracao.module').then( m => m.ConfiguracaoPageModule)
  },
  {
    path: 'registrar',
    loadChildren: () => import('./registrar/registrar.module').then( m => m.RegistrarPageModule)
  },
  {
    path: 'ingresso/:id',
    loadChildren: () => import('./ingresso/ingresso.module').then( m => m.IngressoPageModule)
  },
  {
    path: 'eventos-salvos',
    loadChildren: () => import('./eventos-salvos/eventos-salvos.module').then( m => m.EventosSalvosPageModule)
  },
  {
    path: 'historico',
    loadChildren: () => import('./historico/historico.module').then( m => m.HistoricoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
