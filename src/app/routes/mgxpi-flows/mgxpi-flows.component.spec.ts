import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiFlowsComponent } from './mgxpi-flows.component';

describe('MgxpiFlowsComponent', () => {
  let component: MgxpiFlowsComponent;
  let fixture: ComponentFixture<MgxpiFlowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiFlowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiFlowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
