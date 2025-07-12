import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mais-esperados',
  templateUrl: './mais-esperados.component.html',
  styleUrls: ['./mais-esperados.component.scss'],
})
export class MaisEsperadosComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  slideOpts = {
    slidesPerView: 2.5,
    spaceBetween: 10
  };

  eventos = [
    { img: 'assets/imagens-eventos330x160/PosterBanner1.png' },
    { img: 'assets/imagens-eventos330x160/PosterBanner2.png' },
    { img: 'assets/imagens-eventos330x160/PosterBanner3.png' },
    { img: 'assets/imagens-eventos330x160/PosterBanner4.png' },
    { img: 'assets/imagens-eventos330x160/PosterBanner5.png' },
    { img: 'assets/imagens-eventos330x160/PosterBanner6.png' }
  ];


}
