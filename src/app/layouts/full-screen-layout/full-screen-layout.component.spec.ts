import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenLayoutComponent } from './full-screen-layout.component';

describe('FullScreenLayoutComponent', () => {
  let component: FullScreenLayoutComponent;
  let fixture: ComponentFixture<FullScreenLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullScreenLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
