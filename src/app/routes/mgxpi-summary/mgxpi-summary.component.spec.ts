import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiSummaryComponent } from './mgxpi-summary.component';

describe('MgxpiSummaryComponent', () => {
  let component: MgxpiSummaryComponent;
  let fixture: ComponentFixture<MgxpiSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
