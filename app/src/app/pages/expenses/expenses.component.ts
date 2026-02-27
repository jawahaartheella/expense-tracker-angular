import { Component, ViewChild } from '@angular/core';

import { filter, of, switchMap } from 'rxjs';

import { Expense } from '../../core/models/expense.model';
import { Category } from '../../core/models/category.model';
import { ExpenseService } from '../../core/services/expense.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { CategoriesService } from '../../core/services/categories.service';
import { FiltersComponent } from '../../components/filters/filters.component';
import { ExpenseTableComponent } from '../../components/expense-table/expense-table.component';
import { SaveExpenseComponent } from '../../components/save-expense/save-expense.component';
import { Filters } from '../../core/models/filters.model';

@Component({
  selector: 'app-expenses',
  imports: [FiltersComponent, SaveExpenseComponent, ExpenseTableComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {
  @ViewChild('saveExpenseCanvas') saveExpenseCanvas!: SaveExpenseComponent;
  expensesList: Array<Expense> = [];
  filteredExpensesList: Array<Expense> = [];
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
        this.expensesList = res.slice().reverse();
        this.filteredExpensesList = this.expensesList;
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

  //Filters:
  parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month-1, day);
  }

  applyDateRangeFilter(expenses: Expense[], range: Date) {
    const startDate = range;
    return expenses.filter(exp => {
      const expenseDate = this.parseDate(exp.date);
      return expenseDate >= startDate;
    });
  }

  applyCategoryFilter(expenses: Expense[], selectedCategory: number) {
    return expenses.filter(exp => parseInt(exp.category) == selectedCategory);
  }

  applyAmountFilter(expenses: Expense[], filters: Filters) {
    const minAmount = filters.minAmount;
    const maxAmount = filters.maxAmount;
    return expenses.filter(exp => {
      if(minAmount && exp.amount < minAmount) return false;
      if(maxAmount && exp.amount > maxAmount) return false;
      return true;
    });
  }

  applySorting(expenses: Expense[], sortByValue: string, sortOrder: string = 'desc') {
    const order = sortOrder == 'desc' ? -1 : 1;
    return [...expenses].sort((a,b) => {
      switch(sortByValue) {
        case 'amount':
          return (a.amount - b.amount) *  order;
        case 'date':
          return (this.parseDate(a.date).getTime() - this.parseDate(b.date).getTime()) * order;
        case 'title':
          return a.title.localeCompare(b.title) * order;
        default:
          return 0;
      }
    }); 
  }

  applyFilters(filters: Filters) {
    let result = [...this.expensesList];
    
    if(filters.dateRange) {
      result = this.applyDateRangeFilter(result, filters.dateRange);
    }
    if(filters.category) {
      result = this.applyCategoryFilter(result, filters.category);
    }
    if(filters.minAmount || filters.maxAmount) {
      result = this.applyAmountFilter(result, filters);
    }
    if(filters.sortBy) {
      result = this.applySorting(result, filters.sortBy, 'asc');
    }

    this.filteredExpensesList = result;
  }

  /////

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
