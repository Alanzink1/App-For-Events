import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventosSalvosPage } from './eventos-salvos.page';

describe('EventosSalvosPage', () => {
  let component: EventosSalvosPage;
  let fixture: ComponentFixture<EventosSalvosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventosSalvosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
