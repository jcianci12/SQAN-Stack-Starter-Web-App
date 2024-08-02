import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonpillComponent } from './personpill.component';

describe('PersonpillComponent', () => {
  let component: PersonpillComponent;
  let fixture: ComponentFixture<PersonpillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonpillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonpillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
