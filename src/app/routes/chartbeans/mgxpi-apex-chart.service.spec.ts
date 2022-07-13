import { TestBed } from '@angular/core/testing';

import { MgxpiApexChartService } from './mgxpi-apex-chart.service';

describe('MgxpiApexChartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MgxpiApexChartService = TestBed.get(MgxpiApexChartService);
    expect(service).toBeTruthy();
  });
});
