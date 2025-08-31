import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { CrudService } from '../services/crud.service';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {
  isLoading: boolean = false;
  userId: string | null = null;
  eventos: any;

  constructor(private crudService: CrudService, private auth: Auth, private firestore: Firestore) { }

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
          const userRef = doc(this.firestore, "usuarios", this.userId);
          const userSnap = await getDoc(userRef);
    
          if (userSnap.exists()) {
            const userData = userSnap.data() as any;
            const eventosIds: string[] = userData.historico || [];
    
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
