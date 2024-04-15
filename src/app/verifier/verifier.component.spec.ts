import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifierComponent } from './verifier.component';

describe('VerifierComponent', () => {
  let component: VerifierComponent;
  let fixture: ComponentFixture<VerifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
