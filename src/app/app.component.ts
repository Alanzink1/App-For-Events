import { Component, NgModule } from '@angular/core';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { register } from 'swiper/element/bundle';
import { AuthenticateService } from './services/auth.service';
import { App } from '@capacitor/app';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  constructor(private platform: Platform, private authService: AuthenticateService) {
    this.platform.ready().then(() => {
      this.setStatusBar();
    });
    this.initializeApp();
  }

  async initializeApp() {
    const ativo = await this.authService.biometriaAtiva();
    if (ativo) {
      const ok = await this.authService.autenticarComBiometria(); 
      if (!ok) {
        App.exitApp(); // fecha o app
      }
    }
  }


  async setStatusBar() {
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setBackgroundColor({ color: '#2196F3' }); // azul
    await StatusBar.setStyle({ style: Style.Light }); // texto branco
  }
}
