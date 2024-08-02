import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenfieldComponent } from './hiddenfield.component';

describe('HiddenfieldComponent', () => {
  let component: HiddenfieldComponent;
  let fixture: ComponentFixture<HiddenfieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiddenfieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
