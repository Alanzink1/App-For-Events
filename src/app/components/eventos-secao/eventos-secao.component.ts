import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos-secao',
  templateUrl: './eventos-secao.component.html',
  styleUrls: ['./eventos-secao.component.scss'],
})
export class EventosSecaoComponent  implements OnInit {

  @Input() titulo: string = '';

  constructor() { }

  ngOnInit() {}

  slideOpts = {
    slidesPerView: 2.5,
    spaceBetween: 10
  };

  eventos = [
    { img: 'assets/imagens-eventos100x150/Poster2.png' },
    { img: 'assets/imagens-eventos100x150/Poster1.png' },
    { img: 'assets/imagens-eventos100x150/Poster3.png' },
    { img: 'assets/imagens-eventos100x150/Poster4.png' },
    { img: 'assets/imagens-eventos100x150/Poster5.png' },
    { img: 'assets/imagens-eventos100x150/Poster6.png' }
  ];

}
