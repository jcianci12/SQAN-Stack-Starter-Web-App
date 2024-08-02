import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocoderinputComponent } from './geocoderinput.component';

describe('GeocoderinputComponent', () => {
  let component: GeocoderinputComponent;
  let fixture: ComponentFixture<GeocoderinputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeocoderinputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocoderinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
