import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeButtonComponent } from './edge-button.component';

describe('EdgeButtonComponent', () => {
  let component: EdgeButtonComponent;
  let fixture: ComponentFixture<EdgeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdgeButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdgeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
