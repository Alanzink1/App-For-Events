import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';
import { Browser } from '@capacitor/browser';
import { environment } from 'src/environments/environment';
import { Auth, onAuthStateChanged, user, User } from '@angular/fire/auth';
import { arrayUnion, doc, serverTimestamp, updateDoc, Firestore, arrayRemove, getDoc } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { AnimationOptions } from 'ngx-lottie';
import { LottieModule } from 'ngx-lottie'; // ✅ Importação necessária para o modal
import { SuccessModalComponent } from '../components/success-modal/success-modal.component';
import { profile } from 'console';



@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
})
export class EventoPage implements OnInit {

  evento: any;
  eventosSalvos: any;
  urlMapaEstatico: string = '';
  isConfirming = false;
  isLogged: User | null = null;
  heartName: string = 'heart-outline';
  
  private apiKey = environment.googleMapsApiKey;

  @ViewChild('mapaContainer') mapaContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private crudService: CrudService,
    private router: Router,
    private auth: Auth,
    private modalController: ModalController,
    private firestore: Firestore 
  ) { }

  ngOnInit() {

    onAuthStateChanged(this.auth, async (user) => {
      this.isLogged = user;
      
      
      this.route.params.subscribe(async params => {
        const id = params['id'];
        if (!id) return;
        
        
        // busca o evento independente de estar logado
        this.evento = await this.crudService.fetchById(id, 'eventos');
        setTimeout(() => this.gerarUrlMapa(), 0);

        if (user) {
          this.adicionarAoHistorico(user?.uid);
          
          const userDocRef = doc(this.firestore, "usuarios", user.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const userData = userSnap.data() as any;
            if (userData.eventosId && userData.eventosId.includes(this.evento.id)) {
              this.heartName = 'heart';
            } else {
              this.heartName = 'heart-outline';
            }
          } else {
            this.heartName = 'heart-outline';
          }

        } else {
          // usuário não logado: apenas define heart-outline
          this.heartName = 'heart-outline';
        }
      });
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

  async salvarFavoritos() {
    const isFavoritado = this.heartName === 'heart'; // antes da troca

    this.heartName = isFavoritado ? 'heart-outline' : 'heart';

    onAuthStateChanged(this.auth, async (user) => {
      if (!user) return;

      try {
        const userRef = doc(this.firestore, "usuarios", user.uid);

        await updateDoc(userRef, {
          eventosId: isFavoritado 
            ? arrayRemove(this.evento.id)
            : arrayUnion(this.evento.id) 
        });

      } catch (error) {
        console.error("Erro ao salvar evento:", error);
      }
    });
  }

  async adicionarAoHistorico(userId: string) {
    if (!this.evento?.id) return; // garante que o evento já existe

    try {
      const userRef = doc(this.firestore, "usuarios", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;

      const userData = userSnap.data() as any;
      let historico = userData.historico || [];

      // remove o evento se já existir para não duplicar
      historico = historico.filter((id: string) => id !== this.evento.id);

      // adiciona o novo evento no início
      historico.unshift(this.evento.id);

      // limita a 10 itens
      if (historico.length > 10) {
        historico = historico.slice(0, 10);
      }

      // atualiza o Firestore
      await updateDoc(userRef, { historico });

    } catch (error) {
      console.error("Erro ao atualizar histórico do usuário:", error);
    }
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