import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiLoginComponent } from './mgxpi-login.component';

describe('MgxpiLoginComponent', () => {
  let component: MgxpiLoginComponent;
  let fixture: ComponentFixture<MgxpiLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
