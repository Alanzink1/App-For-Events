import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';

interface Evento {
  id: string;
  imagemUrl: string;
  titulo: string;
  descricao: string;
  cidade: string;
  [key: string]: any;
}

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.page.html',
  styleUrls: ['./pesquisa.page.scss'],
})
export class PesquisaPage implements OnInit {

  isLoading: boolean = false;
  eventos: Evento[] = []; // Esta lista será a que o usuário vê (filtrada)
  private todosOsEventos: Evento[] = []; // Esta guardará a lista original completa

  constructor(private crudService: CrudService) { }

  ngOnInit() {
    this.listarEventos();
  }

  async listarEventos() {
    this.isLoading = true;
    const eventosRecebidos = await this.crudService.fetchAllGeneric<Evento>('eventos');
    
    if (eventosRecebidos && eventosRecebidos.length > 0) {
      this.todosOsEventos = eventosRecebidos; // Guarda a lista completa
      this.eventos = [...this.todosOsEventos]; // Inicia a lista visível com todos os eventos
    }
    
    this.isLoading = false;
  }

  // Nova função para lidar com a busca
  handleSearch(event: any) {
    const termoDeBusca = event.target.value.toLowerCase();

    // Se o campo de busca estiver vazio, mostra todos os eventos
    if (!termoDeBusca || termoDeBusca.trim() === '') {
      this.eventos = [...this.todosOsEventos];
      return;
    }

    // Filtra a lista completa de eventos
    this.eventos = this.todosOsEventos.filter(evento => 
      evento.titulo.toLowerCase().includes(termoDeBusca)
    );
  }
}