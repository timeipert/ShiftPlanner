import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityFormComponent } from './availability-form.component';

describe('AvailabilityFormComponent', () => {
  let component: AvailabilityFormComponent;
  let fixture: ComponentFixture<AvailabilityFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvailabilityFormComponent]
    });
    fixture = TestBed.createComponent(AvailabilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
