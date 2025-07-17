import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatListComponent } from './boat-list.component';

describe('BoatListComponent', () => {
  let component: BoatListComponent;
  let fixture: ComponentFixture<BoatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoatListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
