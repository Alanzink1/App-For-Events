import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
})
export class EventoPage implements OnInit {

  evento: any;

  constructor(
    private route: ActivatedRoute,
    private crudService: CrudService
  ) { }

  ngOnInit() {
  this.route.params.subscribe(params => {
    const id = params['id'];
    this.crudService.fetchById(id, 'eventos').then(evento => {
      this.evento = evento;
      console.log(this.evento)
    });
  });
}

}
