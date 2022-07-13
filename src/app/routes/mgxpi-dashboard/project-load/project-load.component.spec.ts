import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLoadComponent } from './project-load.component';

describe('ProjectLoadComponent', () => {
  let component: ProjectLoadComponent;
  let fixture: ComponentFixture<ProjectLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
