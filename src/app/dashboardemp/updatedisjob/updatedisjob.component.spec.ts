import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedisjobComponent } from './updatedisjob.component';

describe('UpdatedisjobComponent', () => {
  let component: UpdatedisjobComponent;
  let fixture: ComponentFixture<UpdatedisjobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatedisjobComponent]
    });
    fixture = TestBed.createComponent(UpdatedisjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
