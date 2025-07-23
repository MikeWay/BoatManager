import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutCompleteComponent } from './check-out-complete.component';

describe('CheckOutCompleteComponent', () => {
  let component: CheckOutCompleteComponent;
  let fixture: ComponentFixture<CheckOutCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckOutCompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckOutCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
