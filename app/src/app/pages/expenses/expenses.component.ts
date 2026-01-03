import { Component, ViewChild } from '@angular/core';

import { of, switchMap } from 'rxjs';

import { Expense } from '../../core/models/expense.model';
import { Category } from '../../core/models/category.model';
import { ExpenseService } from '../../core/services/expense.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { CategoriesService } from '../../core/services/categories.service';
import { FiltersComponent } from '../../components/filters/filters.component';
import { ExpenseTableComponent } from '../../components/expense-table/expense-table.component';
import { SaveExpenseComponent } from '../../components/save-expense/save-expense.component';

@Component({
  selector: 'app-expenses',
  imports: [FiltersComponent, SaveExpenseComponent, ExpenseTableComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {
  @ViewChild('saveExpenseCanvas') saveExpenseCanvas!: SaveExpenseComponent;
  expensesList: Array<Expense> = [];
  categoriesList: Array<Category> = [];

  constructor(private expenseService: ExpenseService,
    private categoryService: CategoriesService,
    private confirmService: ConfirmService
  ) { }

  ngOnInit() {
    this.getExpenses();
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categoriesList = res;
      }
    })
  }

  getExpenses() {
    this.expenseService.getAllExpenses().subscribe({
      next: (res) => {
        this.expensesList = res;
      }
    }); 
  }

  updateExpenseList(event: any) {
    const newExpense = event
    const index = this.expensesList.findIndex(e => e.id == newExpense.id);
    this.expensesList = index !== -1 ? this.expensesList.map(e => e.id == newExpense.id ? newExpense : e) : [...this.expensesList, newExpense];
  }

  openExpenseCanvas(isEdit: boolean, expenseDetails?: Expense) {
    if(isEdit && expenseDetails) {
      this.saveExpenseCanvas.openEditCanvas(expenseDetails);
    } else {
      this.saveExpenseCanvas.openAddCanvas();
    }
  }

  bookmarkSelectedExpense(expense: Expense) { 
    this.confirmService.open(
      !expense.isBookmarked ? `Bookmark ${expense.title}` : `Remove bookmark for ${expense.title}`,
      `Confirm to ${!expense.isBookmarked ? 'bookmark' : 'remove bookamark for'} this expense`,
    ).pipe(
      switchMap(confirmed => {
        if(confirmed) {
          expense.isBookmarked = !expense.isBookmarked;
        }
        return confirmed ? this.expenseService.editExpense(expense.id, expense) : of(null);
      })
    ).subscribe({
      next: (res) => {
        if(res) {
          this.confirmService.currentModal.hide();
          this.updateExpenseList(res);
        }
      }
    });
  }

  deleteSelectedExpense(expense: Expense) {
    this.confirmService.open(
      `Delete "${expense.title}" Expense`,
      'Are you sure you want to delete this expense.',
      'Delete',
      'btn-danger',
      'Cancel'
    ).pipe(
      switchMap(confirmed => {
        return confirmed ? this.expenseService.deleteExpense(expense.id) : of(null);
      })
    ).subscribe({
      next: (res) => {
        if(res) {
          this.confirmService.currentModal.hide();
          this.expensesList = this.expensesList.filter(c => c.id !== expense.id);
        }
      }
    });
  }
}
