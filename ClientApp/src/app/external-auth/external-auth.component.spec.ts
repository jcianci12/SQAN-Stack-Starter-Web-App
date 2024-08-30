import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAuthComponent } from './external-auth.component';

describe('ExternalAuthComponent', () => {
  let component: ExternalAuthComponent;
  let fixture: ComponentFixture<ExternalAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalAuthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
