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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
