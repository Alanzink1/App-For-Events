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
    // --- 2. ADICIONE OS MÓDULOS DO FIREBASE AOS IMPORTS ---
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule
  ],
  exports: [
    // Exporta seus componentes
    NavbarComponent, 
    HeaderComponent,
    // --- 3. E TAMBÉM EXPORTA OS MÓDULOS DO FIREBASE ---
    AngularFireModule,
    AngularFireAuthModule
  ]
})
export class SharedModule {}