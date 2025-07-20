import { Component, Input, ViewChild, ElementRef, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SwiperOptions } from 'swiper/types';
import { firstValueFrom } from 'rxjs';

import { Geolocation } from '@capacitor/geolocation';
import { CrudService } from 'src/app/services/crud.service';
import { MapsService } from '../../services/maps.service';

interface Evento {
  id: string;
  imagemUrl: string;
  titulo: string;
  descricao: string;
  cidade: string;
  [key: string]: any;
}

@Component({
  selector: 'app-eventos-secao',
  templateUrl: './eventos-secao.component.html',
  styleUrls: ['./eventos-secao.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventosSecaoComponent implements OnInit {

  @Input() titulo: string = '';
  @Input() categoria: string = '';
  
  showSection: boolean = false;
  isLoading: boolean = false;
  eventos: Evento[] = [];

  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  public swiperBreakpoints = {
  '576': { slidesPerView: 2.2, spaceBetween: 12 },
  '768': { slidesPerView: 3.2, spaceBetween: 12 },
  '992': { slidesPerView: 4.2, spaceBetween: 16 },
  '1080': { slidesPerView: 5.2, spaceBetween: 22 }
  };


  constructor(
    private crudService: CrudService,
    private mapsService: MapsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.categoria === 'Próximos') {
      this.iniciarBuscaProximos();
    } else if (this.categoria) {
      this.listarEventosPorCategoria();
    } else {
      this.listarEventos();
    }
  }

  async iniciarBuscaProximos() {
    this.showSection = true;
    this.isLoading = true;

    try {
      const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      const userLocation = { lat: coordinates.coords.latitude, lng: coordinates.coords.longitude };

      const [lugaresProximos, cidadeAtual] = await Promise.all([
        firstValueFrom(this.mapsService.findCitiesByTextSearch(userLocation)),
        firstValueFrom(this.mapsService.getCityFromCoords(userLocation))
      ]);

      let nomesCidades: (string | null)[] = [];
      if (lugaresProximos && lugaresProximos.length > 0) {
        nomesCidades = lugaresProximos.map(lugar => {
          if (lugar.types.includes('locality')) return lugar.name;
          const addressParts = lugar.formatted_address.split(',');
          if (addressParts.length >= 3) return addressParts[addressParts.length - 3].split(' - ')[0].trim();
          return null;
        });
      }

      if (cidadeAtual) {
        nomesCidades.push(cidadeAtual);
      }
      
      const nomesFiltrados = nomesCidades.filter(nome => nome !== null);
      const nomesUnicos = [...new Set(nomesFiltrados)];
      
      if (nomesUnicos.length > 0) {
        this.eventos = await this.crudService.fetchWhereIn<Evento>('eventos', 'cidade', nomesUnicos);
        if (this.eventos.length > 0) {
          this.initSwiper();
        } else {
          this.showSection = false;
        }
      } else {
        this.showSection = false;
      }
    } catch (error) {
      console.error("Erro no fluxo de busca por proximidade:", error);
      this.showSection = false;
    } finally {
      this.isLoading = false;
    }
  }

  async listarEventosPorCategoria() {
    this.showSection = true;
    this.isLoading = true;

    const eventosRecebidos = await this.crudService.fetchByOperatorParam('categoria', 'array-contains', this.categoria, 'eventos');
    
    if (eventosRecebidos && eventosRecebidos.length > 0) {
      this.eventos = eventosRecebidos;
      this.initSwiper();
    } else {
      this.showSection = false;
    }
    
    this.isLoading = false;
  }

  async listarEventos() {
    this.showSection = true;
    this.isLoading = true;

    const eventosRecebidos = await this.crudService.fetchAll('eventos');
    
    if (eventosRecebidos && eventosRecebidos.length > 0) {
      this.eventos = eventosRecebidos;
      this.initSwiper();
    } else {
      this.showSection = false;
    }
    
    this.isLoading = false;
  }

  initSwiper() {
    this.cdr.detectChanges(); 
    setTimeout(() => {
      if (this.swiperRef?.nativeElement) {
        const swiperEl = this.swiperRef.nativeElement;
        const finalSlideOpts = { loop: this.eventos.length > 3 };
        Object.assign(swiperEl, finalSlideOpts);
        
      }
    }, 100);
  }
}