import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTestComponent } from './unit-test.component';

describe('UnitTestComponent', () => {
  let component: UnitTestComponent;
  let fixture: ComponentFixture<UnitTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnitTestComponent]
    });
    fixture = TestBed.createComponent(UnitTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
