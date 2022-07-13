import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAlertComponent } from './project-alert.component';

describe('ProjectAlertComponent', () => {
  let component: ProjectAlertComponent;
  let fixture: ComponentFixture<ProjectAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
