import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaMotoristaPage } from './mapa-motorista.page';

describe('MapaMotoristaPage', () => {
  let component: MapaMotoristaPage;
  let fixture: ComponentFixture<MapaMotoristaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaMotoristaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
