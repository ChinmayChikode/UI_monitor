import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiLicenseSummaryComponent } from './mgxpi-license-summary.component';

describe('MgxpiLicenseSummaryComponent', () => {
  let component: MgxpiLicenseSummaryComponent;
  let fixture: ComponentFixture<MgxpiLicenseSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiLicenseSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiLicenseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
