import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmadosPage } from './confirmados.page';

describe('ConfirmadosPage', () => {
  let component: ConfirmadosPage;
  let fixture: ComponentFixture<ConfirmadosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConfirmadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
