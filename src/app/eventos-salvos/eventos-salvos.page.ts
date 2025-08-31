import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CrudService } from '../services/crud.service';
import { onAuthStateChanged } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';

interface Evento {
  id: string;
  titulo: string;
  imagemUrl: string;
  cidade: string;
  data: any;
  dataDia: string,
  dataMes: string,
  diaDaSemana: string,
  local: string;
  [key: string]: any;
}

@Component({
  selector: 'app-eventos-salvos',
  templateUrl: './eventos-salvos.page.html',
  styleUrls: ['./eventos-salvos.page.scss'],
  })

export class EventosSalvosPage implements OnInit {

  isLoading: boolean = false;
  userId: string | null = null;
  eventos: any;

  constructor(private crudService: CrudService, private auth: Auth, private firestore: Firestore) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
        this.listarEventos();
      } else {
        this.userId = null;
        this.eventos = [];
        this.isLoading = false;
      }
    });
  }

  async listarEventos() {
    if (!this.userId) return;

    this.isLoading = true;

    try {
      // busca os eventos salvos do usuário
      const userRef = doc(this.firestore, "usuarios", this.userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as any;
        const eventosIds: string[] = userData.eventosId || [];

        // busca os eventos no Firestore
        const eventosPromises = eventosIds.map(id =>
          this.crudService.fetchById(id, "eventos")
        );

        this.eventos = await Promise.all(eventosPromises);
      }
    } catch (error) {
      console.error("Erro ao listar eventos salvos:", error);
    } finally {
      this.isLoading = false;
    }
  }

}
