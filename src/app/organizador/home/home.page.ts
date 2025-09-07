import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { AuthenticateService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AdicionarEventoComponent } from './modals/adicionar-evento/adicionar-evento.component';
import { ModalController } from '@ionic/angular';
import { EditarEventoComponent } from './modals/editar-evento/editar-evento.component';

interface Evento {
  id: string;
  titulo: string;
  imagemUrl: string;
  cidade: string;
  organizadorId: string;
  data: any;
  dataDia: string,
  dataMes: string,
  diaDaSemana: string,
  local: string;
  [key: string]: any;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userId: string | null = null;
  eventos: any[] = []; ;
  isLoading: boolean = true;

  constructor(
    private firestore: Firestore,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticateService,
    private crudService: CrudService,
    private auth: Auth,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
  onAuthStateChanged(this.auth, async (user) => {
    if (user) {
      this.userId = user.uid;
      await this.listarEventos();
    }
  });
}

async listarEventos() {
  this.isLoading = true;

  try {
    if (!this.userId) return;

    const usuarioData = await this.crudService.fetchById(this.userId, 'organizadores');
    const eventosData = usuarioData.eventosId || [];

    const eventosPromises = eventosData.map((id: string) => 
      this.crudService.fetchById(id, "eventos")
    );

    
    this.eventos = await Promise.all(eventosPromises);
    console.log(this.eventos)

  } catch (error) {
    console.error("Erro ao listar eventos:", error);
  } finally {
    this.isLoading = false;
  }
}

  async adicionarEvento() {
    const modal = await this.modalCtrl.create({
        component: AdicionarEventoComponent,
      });
      await modal.present();
  
      const { data } = await modal.onWillDismiss();
      if (data) {
        console.log('Dados atualizados:', data); // aqui você pode atualizar localmente a UI
      }
  }

  async editarEvento(evento: any) {
    const modal = await this.modalCtrl.create({
      component: EditarEventoComponent,
      componentProps: { evento } // 👉 passa o evento para o modal
    });

    modal.onDidDismiss().then((res) => {
      if (res.data && res.data.sucesso) {
        this.listarEventos(); // 👉 recarrega a lista depois da edição
      }
    });

    return await modal.present();
  }

}