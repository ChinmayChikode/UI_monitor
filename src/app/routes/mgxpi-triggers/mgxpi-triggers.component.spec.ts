import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiTriggersComponent } from './mgxpi-triggers.component';

describe('MgxpiTriggersComponent', () => {
  let component: MgxpiTriggersComponent;
  let fixture: ComponentFixture<MgxpiTriggersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiTriggersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiTriggersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
