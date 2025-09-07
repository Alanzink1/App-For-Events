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
  idIngresso: string;
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
  eventosIrei: IngressoConfirmado[] = [];
  eventosJaFui: IngressoConfirmado[] = [];
  eventosIreiAgrupados: { mes: string; eventos: IngressoConfirmado[] }[] = [];
  eventosJaFuiAgrupados: { mes: string; eventos: IngressoConfirmado[] }[] = [];
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

  agruparEventosPorMes(eventos: IngressoConfirmado[]): { mes: string; eventos: IngressoConfirmado[] }[] {
  if (!eventos.length) {
    return [];
  }

  // Usamos Intl.DateTimeFormat para obter o nome do mês e ano de forma correta
  const getNomeMes = (data: Date) => {
    const nome = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(data);
    return nome.charAt(0).toUpperCase() + nome.slice(1); // Ex: "Agosto de 2025"
  };

  const grupos = eventos.reduce((acc, evento) => {
    const dataEvento = evento.data?.toDate?.() || new Date(evento.data + 'T00:00:00');
    const nomeMes = getNomeMes(dataEvento);

    // Se o grupo para este mês ainda não existe, crie-o
    if (!acc[nomeMes]) {
      acc[nomeMes] = [];
    }

    // Adicione o evento ao grupo do mês correspondente
    acc[nomeMes].push(evento);
    return acc;
  }, {} as { [key: string]: IngressoConfirmado[] });

  // Transforma o objeto de grupos em um array e ordena por data
  return Object.keys(grupos).map(mes => ({
    mes: mes,
    eventos: grupos[mes].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()) // Ordena eventos dentro do mês
  })).sort((a, b) => {
    const dataA = a.eventos[0].data?.toDate?.() || new Date(a.eventos[0].data);
    const dataB = b.eventos[0].data?.toDate?.() || new Date(b.eventos[0].data);
    return dataA.getTime() - dataB.getTime(); // Ordena os meses
  });
}

  async listarEventosConfirmados() {
  if (!this.userId) return;

  this.isLoading = true;
  // Limpa as listas antes de buscar novos dados
  this.eventosIreiAgrupados = [];
  this.eventosJaFuiAgrupados = [];

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

      // Mapeia os dados como antes
      const todosOsConfirmados = ingressosDoUsuario
        .map((ingresso: Ingresso): IngressoConfirmado | null => {
          const eventoCorrespondente = detalhesDosEventos.find(
            (evento) => evento.id === ingresso.eventoId
          );

          if (!eventoCorrespondente) return null;

          const dataEvento: Date = eventoCorrespondente.data?.toDate?.() || new Date(eventoCorrespondente.data + 'T00:00:00');
          const dia = dataEvento.getDate().toString().padStart(2, '0');
          const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
          const mes = meses[dataEvento.getMonth()];
          const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
          const diaDaSemana = diasSemana[dataEvento.getDay()];

          return {
            ...eventoCorrespondente,
            ...ingresso,
            dataDia: dia,
            dataMes: mes,
            diaDaSemana: diaDaSemana,
          } as IngressoConfirmado;
        })
        .filter((item): item is IngressoConfirmado => item !== null);

      // ✅ LÓGICA ADICIONADA: SEPARA OS EVENTOS EM FUTUROS E PASSADOS
      const agora = new Date(); // Pega a data e hora atuais

      todosOsConfirmados.forEach(evento => {
        // Converte a data do evento (que pode ser string ou timestamp) para um objeto Date
        const dataEvento = evento.data?.toDate?.() || new Date(evento.data + 'T00:00:00');

        if (dataEvento >= agora) {
          this.eventosIrei.push(evento); // Correto: adiciona à lista simples
        } else {
          this.eventosJaFui.push(evento); // Correto: adiciona à lista simples
        }
      });
    }
  } catch (error) {
    console.error('Erro ao listar eventos confirmados:', error);
  }


  this.eventosIreiAgrupados = this.agruparEventosPorMes(this.eventosIrei);
  this.eventosJaFuiAgrupados = this.agruparEventosPorMes(this.eventosJaFui);


  this.isLoading = false;
}
}
