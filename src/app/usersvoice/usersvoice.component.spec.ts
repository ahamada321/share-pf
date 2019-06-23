import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersVoiceComponent } from './usersvoice.component';

describe('UsersVoiceComponent', () => {
  let component: UsersVoiceComponent;
  let fixture: ComponentFixture<UsersVoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersVoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersVoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
