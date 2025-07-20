import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { SwiperOptions } from 'swiper/types';

interface Evento {
  id: string;
  bannerUrl: string;
  razaoSocial: string;
  link: string;
  datahora: string;
  [key: string]: any;
}

@Component({
  selector: 'app-mais-esperados',
  templateUrl: './mais-esperados.component.html',
  styleUrls: ['./mais-esperados.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MaisEsperadosComponent implements OnInit {

  @ViewChildren('eventoImg') eventoImgs!: QueryList<ElementRef>;
  @ViewChild('swiper')
    swiperRef: ElementRef | undefined;

  eventos: Evento[] = [];

  slideOpts: SwiperOptions = {
    loop: true,
    initialSlide: 1,
    centeredSlides: true,
    slidesPerView: 1.2,
    spaceBetween: 12,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    }
  };

  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
    this.listarEventos();
  }

  ngAfterViewInit(): void {
    if (this.swiperRef) {
      Object.assign(this.swiperRef.nativeElement, this.slideOpts);
      this.swiperRef.nativeElement.initialize();
    }
  }

  async listarEventos() {

    const eventosRecebidos = await this.crudService.fetchAll('patrocinadores');
    
    if (eventosRecebidos && eventosRecebidos.length > 0) {
      this.eventos = eventosRecebidos;
    }
  }
}
