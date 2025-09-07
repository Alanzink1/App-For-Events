import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { Filesystem, Directory } from '@capacitor/filesystem'; // Opcional
import { toPng } from 'html-to-image'; // Para gerar PNG do QR code
import { Media, MediaSaveOptions } from '@capacitor-community/media';
import { AlertController, ToastController } from '@ionic/angular';
import { Firestore, collection, query, where, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-ingresso',
  templateUrl: './ingresso.page.html',
  styleUrls: ['./ingresso.page.scss'],
})
export class IngressoPage implements OnInit {
  evento: any;
  qrData: any;

  diaSemana!: string;
  dia!: string;
  mes!: string;
  ano!: string;

  userId: string | null = null;

  @ViewChild('areaParaSalvar') areaParaSalvar!: ElementRef;

  constructor(
    private crudService: CrudService,
    private route: ActivatedRoute,
    private firestore: Firestore,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private auth: Auth
  ) {
    // Captura usuário logado
    onAuthStateChanged(this.auth, user => {
      if (user) this.userId = user.uid;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        // Busca ingresso pelo id
        this.crudService.fetchById(id, 'ingressos').then(ingresso => {
          if (!ingresso) return;

          // Busca evento vinculado ao ingresso
          this.crudService.fetchById(ingresso.eventoId, 'eventos').then(evento => {
            this.evento = evento;

            const dadosIngresso = {
              valido: ingresso.valido,
              dataCompra: ingresso.dataCompra,
              eventoId: ingresso.eventoId,
              organizadorId: ingresso.organizadorId || '',
              tipoIngresso: ingresso.tipoIngresso,
              usuarioId: ingresso.usuarioId,
              valorPago: ingresso.valorPago
            };

            this.qrData = JSON.stringify(dadosIngresso);

            if (evento.data) {
              this.formatarData(evento.data);
            }
          });
        });
      }
    });
  }

  private formatarData(dataEvento: string) {
    const data = new Date(dataEvento + 'T00:00:00');
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const meses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    this.diaSemana = diasSemana[data.getDay()];
    this.dia = data.getDate().toString().padStart(2, '0');
    this.mes = meses[data.getMonth()];
    this.ano = data.getFullYear().toString();
  }

  async baixarIngresso() {
    if (!this.areaParaSalvar) {
      console.error('Elemento HTML não encontrado!');
      return;
    }

    try {
      const dataUrl = await toPng(this.areaParaSalvar.nativeElement);
      const base64Data = dataUrl.split(',')[1];

      const options: MediaSaveOptions = {
        path: base64Data,
        albumIdentifier: 'MeusIngressos',
        fileName: `ingresso-${this.evento.titulo.replace(' ', '-')}`
      };

      await Media.savePhoto(options);

      this.showToast('Ingresso salvo na galeria com sucesso!', 'success');

    } catch (error) {
      console.error('Erro ao salvar o ingresso na galeria:', error);
      this.showToast('Erro ao salvar o ingresso. Verifique as permissões.', 'danger');
    }
  }

  async cancelarIngresso() {
    if (!this.userId || !this.evento?.id) return;

    const alert = await this.alertCtrl.create({
      header: 'Cancelar Ingresso',
      message: 'Tem certeza que deseja cancelar este ingresso?',
      buttons: [
        { text: 'Não', role: 'cancel' },
        {
          text: 'Sim',
          handler: async () => {
            try {
              const ingressosRef = collection(this.firestore, 'ingressos');
              const q = query(
                ingressosRef,
                where('eventoId', '==', this.evento.id),
                where('usuarioId', '==', this.userId)
              );

              const querySnapshot = await getDocs(q);

              if (querySnapshot.empty) {
                this.showToast('Ingresso não encontrado.', 'danger');
                return;
              }

              // Deletar ingresso(s)
              for (const docSnap of querySnapshot.docs) {
                await deleteDoc(doc(this.firestore, 'ingressos', docSnap.id));
              }

              this.showToast('Ingresso cancelado com sucesso.', 'success');
              this.evento = null; // Remove dados do evento da tela
            } catch (err) {
              console.error('Erro ao cancelar ingresso:', err);
              this.showToast('Erro ao cancelar ingresso.', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
