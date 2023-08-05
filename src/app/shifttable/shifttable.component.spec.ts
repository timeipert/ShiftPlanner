import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShifttableComponent } from './shifttable.component';

describe('ShifttableComponent', () => {
  let component: ShifttableComponent;
  let fixture: ComponentFixture<ShifttableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShifttableComponent]
    });
    fixture = TestBed.createComponent(ShifttableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
