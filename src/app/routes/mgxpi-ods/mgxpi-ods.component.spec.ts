import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiOdsComponent } from './mgxpi-ods.component';

describe('MgxpiOdsComponent', () => {
  let component: MgxpiOdsComponent;
  let fixture: ComponentFixture<MgxpiOdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiOdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiOdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
