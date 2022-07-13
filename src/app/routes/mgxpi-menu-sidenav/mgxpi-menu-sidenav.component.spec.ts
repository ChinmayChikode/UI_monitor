import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiMenuSidenavComponent } from './mgxpi-menu-sidenav.component';

describe('MgxpiMenuSidenavComponent', () => {
  let component: MgxpiMenuSidenavComponent;
  let fixture: ComponentFixture<MgxpiMenuSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiMenuSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiMenuSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
