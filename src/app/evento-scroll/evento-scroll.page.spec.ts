import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EventoScrollPage } from './evento-scroll.page';

describe('EventoScrollPage', () => {
  let component: EventoScrollPage;
  let fixture: ComponentFixture<EventoScrollPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventoScrollPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
