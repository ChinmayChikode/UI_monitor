import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiActivityComponent } from './mgxpi-activity.component';

describe('MgxpiActivityComponent', () => {
  let component: MgxpiActivityComponent;
  let fixture: ComponentFixture<MgxpiActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
