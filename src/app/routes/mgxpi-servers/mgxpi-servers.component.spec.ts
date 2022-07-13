import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiServersComponent } from './mgxpi-servers.component';

describe('MgxpiServersComponent', () => {
  let component: MgxpiServersComponent;
  let fixture: ComponentFixture<MgxpiServersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiServersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
