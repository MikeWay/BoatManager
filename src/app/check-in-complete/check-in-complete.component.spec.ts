import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInCompleteComponent } from './check-in-complete.component';

describe('CheckInCompleteComponent', () => {
  let component: CheckInCompleteComponent;
  let fixture: ComponentFixture<CheckInCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInCompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
