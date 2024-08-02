import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecimalinputComponent } from './decimalinput.component';

describe('DecimalinputComponent', () => {
  let component: DecimalinputComponent;
  let fixture: ComponentFixture<DecimalinputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecimalinputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecimalinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
