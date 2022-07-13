import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiMessagesComponent } from './mgxpi-messages.component';

describe('MgxpiMessagesComponent', () => {
  let component: MgxpiMessagesComponent;
  let fixture: ComponentFixture<MgxpiMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
