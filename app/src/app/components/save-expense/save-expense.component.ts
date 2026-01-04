import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Expense } from '../../core/models/expense.model';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../core/models/category.model';
import { ExpenseService } from '../../core/services/expense.service';

declare var bootstrap: any;

@Component({
  selector: 'app-save-expense',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './save-expense.component.html',
  styleUrl: './save-expense.component.css'
})
export class SaveExpenseComponent {
  @Output() updateExpense = new EventEmitter<Expense>();
  private offcanvas: any;
  expenseForm!: FormGroup;
  categoryList: Array<Category> = [];
  expenseId!: number;
  isEditMode: boolean = false;
  isRequestInProgress: boolean = false;

  constructor(private categoriesService: CategoriesService,
    private expenseService: ExpenseService) {}

  ngOnInit() {
    this.buildExpenseForm();
    this.getAllCategories();
  }

  getCurrentDate(): string {
    let date = new Date();
    return date.toLocaleDateString().replace(/\//g, '-');
  }

  buildExpenseForm() {
    this.expenseForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      category: new FormControl(0, [Validators.required]),
      amount: new FormControl(0, [Validators.required]),
      notes: new FormControl(''),
      isBookmarked: new FormControl(false)
    });
  }
  
  openAddCanvas() {
    this.isEditMode = false;
    this.openCanvas();  
  }

  openEditCanvas(expenseDetails: Expense) {
    this.isEditMode = true;
    this.expenseForm.patchValue(expenseDetails);
    this.expenseId = expenseDetails.id;
    this.openCanvas();
  }

  openCanvas() {
    const el = document.getElementById('offcanvasRight');
    this.offcanvas = new bootstrap.Offcanvas(el);
    this.offcanvas.show();
  }

  closeCanvas() {
    this.offcanvas?.hide();
    this.expenseForm.reset();
    this.expenseForm.get('category')?.setValue(0);
    this.expenseForm.get('amount')?.setValue(0);
  }

  getAllCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        this.categoryList = res;
      }
    });
  }

  saveExpense() {
    this.isRequestInProgress = true;
    this.expenseForm.get('date')?.setValue(this.getCurrentDate());
    const expenseValue = this.expenseForm.value;
    (this.isEditMode ? this.expenseService.editExpense(this.expenseId, expenseValue) : this.expenseService.addExpense(expenseValue)).subscribe({
      next: (res) => {
        window.alert(`Expense ${this.isEditMode ? 'Added' : 'Updated'} Successfully!!`);
        this.closeCanvas();
        this.isRequestInProgress = false;
        this.updateExpense.emit(res);
      }
    });
  }
}
