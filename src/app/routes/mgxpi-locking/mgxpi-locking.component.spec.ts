import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiLockingComponent } from './mgxpi-locking.component';

describe('MgxpiLockingComponent', () => {
  let component: MgxpiLockingComponent;
  let fixture: ComponentFixture<MgxpiLockingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiLockingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiLockingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
