import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetblogpassComponent } from './forgetblogpass.component';

describe('ForgetblogpassComponent', () => {
  let component: ForgetblogpassComponent;
  let fixture: ComponentFixture<ForgetblogpassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetblogpassComponent]
    });
    fixture = TestBed.createComponent(ForgetblogpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
