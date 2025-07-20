import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';
import { Browser } from '@capacitor/browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
})
export class EventoPage implements OnInit {

  evento: any;
  urlMapaEstatico: string = '';
  private apiKey = environment.googleMapsApiKey;

  @ViewChild('mapaContainer') mapaContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private crudService: CrudService
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

  gerarUrlMapa() {
    if (!this.evento?.geolocalizacao) {
      console.error("ERRO: O objeto 'evento' não possui a propriedade 'geolocalizacao'.");
      return;
    }

    const geo = this.evento.geolocalizacao;
    const lat = parseFloat(geo.Lat);
    const lng = parseFloat(geo.Long);

    if (isNaN(lat) || isNaN(lng)) {
      console.error(`ERRO CRÍTICO: Coordenadas inválidas após conversão! Lat: ${lat}, Lng: ${lng}.`);
      return;
    }
    
    // Usamos o offsetWidth do elemento real para um mapa perfeitamente dimensionado
    const width = this.mapaContainer.nativeElement.offsetWidth;
    const height = 200;

    this.urlMapaEstatico = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=${Math.floor(width)}x${height}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${this.apiKey}`;
  }

  async abrirMapaExterno() {
    if (!this.evento?.geolocalizacao) {
      console.error("Geolocalização do evento não encontrada.");
      return;
    }

    const lat = parseFloat(this.evento.geolocalizacao.Lat);
    const lng = parseFloat(this.evento.geolocalizacao.Long);

    if (isNaN(lat) || isNaN(lng)) {
      console.error("Não é possível abrir o mapa com coordenadas inválidas.");
      return;
    }

    // CORREÇÃO: Esta é a URL universal que força a exibição do pino.
    const url = `https://maps.google.com/?q=${lat},${lng}`;

    console.log("Tentando abrir a URL do mapa externo:", url);
    await Browser.open({ url: url });
  }
}