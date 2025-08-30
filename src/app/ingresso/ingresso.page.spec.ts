import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngressoPage } from './ingresso.page';

describe('IngressoPage', () => {
  let component: IngressoPage;
  let fixture: ComponentFixture<IngressoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IngressoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
