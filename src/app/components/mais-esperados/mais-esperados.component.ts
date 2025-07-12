import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-mais-esperados',
  templateUrl: './mais-esperados.component.html',
  styleUrls: ['./mais-esperados.component.scss'],
  standalone: true,
    imports: [
      CommonModule 
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ]
  
  })

export class MaisEsperadosComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  @ViewChild('swiper')
    swiperRef: ElementRef | undefined;
  
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

  eventos = [
    { img: 'assets/imagens-eventos330x160/PosterBanner1.png' },
    { img: 'assets/imagens-eventos330x160/PosterBanner2.png' },
    { img: 'assets/imagens-eventos330x160/PosterBanner3.png' },
    { img: 'assets/imagens-eventos330x160/PosterBanner4.png' },
    { img: 'assets/imagens-eventos330x160/PosterBanner5.png' },
    { img: 'assets/imagens-eventos330x160/PosterBanner6.png' }
  ];

  ngAfterViewInit() {
    if (this.swiperRef) {
      Object.assign(this.swiperRef.nativeElement, this.slideOpts);
      this.swiperRef.nativeElement.initialize();
    }
  }


}
