import { TestBed } from '@angular/core/testing';

import { PrepaireChartBeanService } from './prepaire-chart-bean.service';

describe('PrepaireChartBeanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrepaireChartBeanService = TestBed.get(PrepaireChartBeanService);
    expect(service).toBeTruthy();
  });
});
