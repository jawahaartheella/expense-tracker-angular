import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveExpenseComponent } from './save-expense.component';

describe('SaveExpenseComponent', () => {
  let component: SaveExpenseComponent;
  let fixture: ComponentFixture<SaveExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
