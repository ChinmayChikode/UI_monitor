import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseUsagesComponent } from './license-usages.component';

describe('LicenseUsagesComponent', () => {
  let component: LicenseUsagesComponent;
  let fixture: ComponentFixture<LicenseUsagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseUsagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseUsagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
