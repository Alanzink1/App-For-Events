import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class SearchbarComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
