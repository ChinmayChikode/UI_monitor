import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerActivityComponent } from './trigger-activity.component';

describe('TriggerActivityComponent', () => {
  let component: TriggerActivityComponent;
  let fixture: ComponentFixture<TriggerActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriggerActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriggerActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
