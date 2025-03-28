import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoFormularioCompletoComponent } from './dialogo-formulario-completo.component';

describe('DialogoFormularioCompletoComponent', () => {
  let component: DialogoFormularioCompletoComponent;
  let fixture: ComponentFixture<DialogoFormularioCompletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoFormularioCompletoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogoFormularioCompletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
