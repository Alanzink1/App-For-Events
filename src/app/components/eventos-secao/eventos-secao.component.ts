import { Component, Input, ViewChild, ElementRef, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe CommonModule para ter acesso ao *ngFor
import { SwiperOptions } from 'swiper/types';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-eventos-secao',
  templateUrl: './eventos-secao.component.html',
  styleUrls: ['./eventos-secao.component.scss'],
  
  standalone: true,
  imports: [
    CommonModule 
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA 
  ]

})
export class EventosSecaoComponent implements AfterViewInit {

  @Input() titulo: string = '';
  @Input() categoria: string = '';

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;

  slideOpts: SwiperOptions = {
    loop: true,
    initialSlide: 1,
    centeredSlides: true,
    slidesPerView: 3.2,
    spaceBetween: 12, 
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    }
  };

  eventos: any[] = [];

  constructor(private crudService: CrudService) {}

  ngOnInit() {
  this.listarEventos();
}

async listarEventos() {
  if (this.categoria) {
    this.eventos = await this.crudService.fetchByOperatorParam(
      'categoria',
      'array-contains',
      this.categoria,
      'eventos'
    );
  } else {
    this.eventos = await this.crudService.fetchAll('eventos');
  }
}

  ngAfterViewInit() {
    if (this.swiperRef) {
      Object.assign(this.swiperRef.nativeElement, this.slideOpts);
      this.swiperRef.nativeElement.initialize();
    }
  }
}