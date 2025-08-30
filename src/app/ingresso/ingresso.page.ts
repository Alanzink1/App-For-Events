import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { Filesystem, Directory } from '@capacitor/filesystem'; // Importe Filesystem e Directory
import { toPng } from 'html-to-image'; // Importe a função toPng
import { Media, MediaSaveOptions } from '@capacitor-community/media';

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

  // Adicione esta linha para referenciar o elemento HTML
  @ViewChild('areaParaSalvar') areaParaSalvar!: ElementRef;

  constructor(
    private crudService: CrudService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.crudService.fetchById(id, 'ingressos').then(ingresso => {
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
    const data = new Date(dataEvento);
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

    // Define as opções para salvar a imagem
    const options: MediaSaveOptions = {
      path: base64Data, // o plugin aceita base64 diretamente
      albumIdentifier: 'MeusIngressos', // Nome do álbum na galeria
      fileName: `ingresso-${this.evento.titulo.replace(' ', '-')}` // Indica que o tipo de mídia é uma imagem
    };

    // Salva a imagem usando o plugin de mídia
    await Media.savePhoto(options);

    alert('Ingresso salvo na galeria com sucesso!');

  } catch (error) {
    console.error('Erro ao salvar o ingresso na galeria:', error);
    alert('Erro ao salvar o ingresso. Verifique as permissões.');
  }
  }
}