import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyJobsComponent } from './company-jobs.component';

describe('CompanyJobsComponent', () => {
  let component: CompanyJobsComponent;
  let fixture: ComponentFixture<CompanyJobsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyJobsComponent]
    });
    fixture = TestBed.createComponent(CompanyJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
