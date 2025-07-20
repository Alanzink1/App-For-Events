import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  isLoading = true;

  constructor(public crudService: CrudService) {}

  ngOnInit() {
    this.simularCarregamento();
    // ou, se quiser carregar dados reais:
    // this.carregarEventos();
  }

  async simularCarregamento() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.isLoading = false;
  }
}
