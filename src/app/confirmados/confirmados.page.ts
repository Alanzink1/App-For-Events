import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { documentId, FieldPath } from 'firebase/firestore'; // ✅ IMPORTAÇÃO CORRETA

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

interface Ingresso {
  id: string;
  eventoId: string;
  usuarioId: string;
  codigoQRCode: string;
  dataCompra: any;
  valido: boolean;
  [key: string]: any;
}

interface IngressoConfirmado extends Evento, Ingresso {}

@Component({
  selector: 'app-confirmados',
  templateUrl: './confirmados.page.html',
  styleUrls: ['./confirmados.page.scss'],
})
export class ConfirmadosPage implements OnInit {
  status = 'irei';
  isLoading: boolean = false;
  confirmados: IngressoConfirmado[] = [];
  userId: string | null = null;

  constructor(private crudService: CrudService, private auth: Auth) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
        this.listarEventosConfirmados();
      } else {
        this.userId = null;
        this.confirmados = [];
        this.isLoading = false;
      }
    });
  }

  async listarEventosConfirmados() {
    if (!this.userId) return;

    this.isLoading = true;
    this.confirmados = [];

    try {
      const ingressosDoUsuario: Ingresso[] = await this.crudService.fetchByOperatorParam(
        'usuarioId',
        '==',
        this.userId,
        'ingressos'
      );

      if (ingressosDoUsuario && ingressosDoUsuario.length > 0) {
        const eventoIds = [...new Set(ingressosDoUsuario.map((ing) => ing.eventoId))];

        const detalhesDosEventos = await this.crudService.fetchWhereIsIn<Evento>(
          'eventos',
          documentId(),
          eventoIds
        );

        this.confirmados = ingressosDoUsuario
          .map((ingresso: Ingresso): IngressoConfirmado | null => {
            const eventoCorrespondente = detalhesDosEventos.find(
              (evento) => evento.id === ingresso.eventoId
            );

            if (!eventoCorrespondente) return null;

            const dataEvento: Date = eventoCorrespondente.data?.toDate?.() || new Date(eventoCorrespondente.data);

            const dia = dataEvento.getDate().toString().padStart(2, '0');
            const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
            const mes = meses[dataEvento.getMonth()];

            const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
            const diaDaSemana = diasSemana[dataEvento.getDay()];

            return {
              ...ingresso,
              ...eventoCorrespondente,
              dataDia: dia,
              dataMes: mes,
              diaDaSemana: diaDaSemana,
            } as IngressoConfirmado;
          })
          .filter((item): item is IngressoConfirmado => item !== null); 
          console.log(this.confirmados);

      }
    } catch (error) {
      console.error('Erro ao listar eventos confirmados:', error);
    }

    this.isLoading = false;
  }
}
