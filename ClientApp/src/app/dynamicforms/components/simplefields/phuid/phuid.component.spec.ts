import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhuidComponent } from './phuid.component';

describe('PhuidComponent', () => {
  let component: PhuidComponent;
  let fixture: ComponentFixture<PhuidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhuidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhuidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
