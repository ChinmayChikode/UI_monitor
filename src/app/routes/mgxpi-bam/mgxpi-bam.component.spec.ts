import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgxpiBamComponent } from './mgxpi-bam.component';

describe('MgxpiBamComponent', () => {
  let component: MgxpiBamComponent;
  let fixture: ComponentFixture<MgxpiBamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgxpiBamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgxpiBamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
