import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';
import { Browser } from '@capacitor/browser';
import { environment } from 'src/environments/environment';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { serverTimestamp } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { AnimationOptions } from 'ngx-lottie';
import { LottieModule } from 'ngx-lottie'; // ✅ Importação necessária para o modal
import { SuccessModalComponent } from '../components/success-modal/success-modal.component';


// --- Componente Principal da Página do Evento ---
@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
})
export class EventoPage implements OnInit {

  evento: any;
  urlMapaEstatico: string = '';
  isConfirming = false;
  private apiKey = environment.googleMapsApiKey;

  @ViewChild('mapaContainer') mapaContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private crudService: CrudService,
    private router: Router,
    private auth: Auth,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.crudService.fetchById(id, 'eventos').then(evento => {
          this.evento = evento;
          setTimeout(() => this.gerarUrlMapa(), 0);
        });
      }
    });
  }

  async confirmarPresenca() {
    this.isConfirming = true;

    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const novoIngresso = {
          usuarioId: user.uid,
          eventoId: this.evento.id,
          organizadorId: this.evento.organizadorId,
          dataCompra: serverTimestamp(),
          valido: true,
          confirmado: true,
          tipoIngresso: this.evento.gratuito ? 'gratuito' : 'pago',
          valorPago: this.evento.gratuito ? -1 : this.evento.valorIngresso,
          comprovantePIX: this.evento.gratuito ? '-1' : 'N/A',
        };

        try {
          await this.crudService.insert(novoIngresso, 'ingressos');
          this.exibirModalSucesso();
        } catch (error) {
          console.error("Erro ao criar ingresso:", error);
          this.isConfirming = false;
        }
      } else {
        this.isConfirming = false;
      }
    });
  }

  async exibirModalSucesso() {
    const modal = await this.modalController.create({
      component: SuccessModalComponent,
      backdropDismiss: false
    });
    
    await modal.present();

    setTimeout(() => {
      modal.dismiss();
      this.router.navigate(['/confirmados']);
    }, 2500);
  }


  gerarUrlMapa() {
    if (!this.evento?.geolocalizacao || !this.mapaContainer?.nativeElement) return;
    
    const geo = this.evento.geolocalizacao;
    const lat = parseFloat(geo.Lat);
    const lng = parseFloat(geo.Long);

    if (isNaN(lat) || isNaN(lng)) return;
    
    const width = this.mapaContainer.nativeElement.offsetWidth;
    const height = 200;

    if (width === 0) return;

    this.urlMapaEstatico = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=${Math.floor(width)}x${height}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${this.apiKey}`;
  }

  async abrirMapaExterno() {
    if (!this.evento?.geolocalizacao) return;

    const lat = parseFloat(this.evento.geolocalizacao.Lat);
    const lng = parseFloat(this.evento.geolocalizacao.Long);

    if (isNaN(lat) || isNaN(lng)) return;
    
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    await Browser.open({ url });
  }
}