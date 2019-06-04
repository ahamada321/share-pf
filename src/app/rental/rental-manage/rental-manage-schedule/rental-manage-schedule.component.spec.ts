import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalManageScheduleComponent } from './rental-manage-schedule.component';

describe('SettingsComponent', () => {
  let component: RentalManageScheduleComponent;
  let fixture: ComponentFixture<RentalManageScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalManageScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalManageScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
