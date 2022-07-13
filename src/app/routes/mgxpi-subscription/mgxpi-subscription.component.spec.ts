import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiSubscriptionComponent } from './mgxpi-subscription.component';

describe('MgxpiSubscriptionComponent', () => {
  let component: MgxpiSubscriptionComponent;
  let fixture: ComponentFixture<MgxpiSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
