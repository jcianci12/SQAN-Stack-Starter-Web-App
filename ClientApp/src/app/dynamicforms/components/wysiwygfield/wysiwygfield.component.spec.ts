import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WysiwygfieldComponent } from './wysiwygfield.component';

describe('WysiwygfieldComponent', () => {
  let component: WysiwygfieldComponent;
  let fixture: ComponentFixture<WysiwygfieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WysiwygfieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WysiwygfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
