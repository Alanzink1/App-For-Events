import { Component, Input, ViewChild, ElementRef, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe CommonModule para ter acesso ao *ngFor
import { SwiperOptions } from 'swiper/types';
import { CrudService } from 'src/app/services/crud.service';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

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
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA 
  ]

})
export class EventosSecaoComponent implements AfterViewInit {

  @Input() titulo: string = '';
  @Input() categoria: string = '';

  isLoading: boolean = true; 

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;

  slideOpts: SwiperOptions = {
  loop: true,
  initialSlide: 1,
  centeredSlides: true,
  spaceBetween: 12,
  slidesPerView: 2.8, 
  
  autoplay: {
    delay: 3000,
    disableOnInteraction: false
  },

  breakpoints: {
    576: {
      slidesPerView: 2.2,
      spaceBetween: 12
    },
    768: {
      slidesPerView: 3.2, 
      spaceBetween: 12
    },
    992: {
      slidesPerView: 4.2,
      spaceBetween: 16 
    }
  }
};

  eventos: any[] = [];

  constructor(private crudService: CrudService) {}

  ngOnInit() {
  this.listarEventos();
}

async listarEventos() {
  this.isLoading = true;
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
  this.isLoading = false;
}

  ngAfterViewInit() {
    if (this.swiperRef) {
      Object.assign(this.swiperRef.nativeElement, this.slideOpts);
      this.swiperRef.nativeElement.initialize();
    }
  }
}