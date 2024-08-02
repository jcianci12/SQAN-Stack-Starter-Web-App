import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimespanComponent } from './timespan.component';

describe('TimespanComponent', () => {
  let component: TimespanComponent;
  let fixture: ComponentFixture<TimespanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimespanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimespanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
