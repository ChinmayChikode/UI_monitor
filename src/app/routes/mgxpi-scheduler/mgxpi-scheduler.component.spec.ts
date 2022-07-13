import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiSchedulerComponent } from './mgxpi-scheduler.component';

describe('MgxpiSchedulerComponent', () => {
  let component: MgxpiSchedulerComponent;
  let fixture: ComponentFixture<MgxpiSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
