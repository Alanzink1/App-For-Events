import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

// --- 1. ADICIONE OS IMPORTS DO FIREBASE ---
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';

// Seus componentes compartilhados (já estavam corretos)
import { NavbarComponent } from '../components/navbar/navbar.component';
import { HeaderComponent } from '../components/header/header.component';

@NgModule({
  declarations: [
    NavbarComponent, 
    HeaderComponent
  ],
  imports: [
    CommonModule, 
    IonicModule, 
    RouterLink,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule
  ],
  exports: [
    NavbarComponent, 
    HeaderComponent,
    AngularFireModule,
    AngularFireAuthModule
  ]
})
export class SharedModule {}