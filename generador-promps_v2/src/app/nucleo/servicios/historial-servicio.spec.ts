import { TestBed } from '@angular/core/testing';

import { HistorialServicio } from './historial-servicio';

describe('HistorialServicio', () => {
  let service: HistorialServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
