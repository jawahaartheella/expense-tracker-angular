import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

import { Expense } from '../../core/models/expense.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-expense-table',
  imports: [NgClass],
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.css'
})
export class ExpenseTableComponent {
  @Input() expenseData?: Array<Expense>;
  @Input() categories?: Array<Category>;
  @Input() showNotesOptions: boolean = false;
  @Input() isTableFixedLayout: boolean = false;

  @Output() emitExpense = new EventEmitter<Expense>;
  @Output() openEditCanvas = new EventEmitter<Expense>;
  @Output() deleteExpense = new EventEmitter<Expense>;
  @Output() bookmarkExpense = new EventEmitter<Expense>;

  emitUpdatedExpense(event: any) {
    let updatedExpense = event;
    this.emitExpense.emit(updatedExpense);
  }

  getCatgeoryName(id: string) {
    const categoryId: number = parseInt(id);
    return this.categories?.find(c => c.id == categoryId)?.name;
  }

  openEditExpeseCanvas(expense: Expense) {
    this.openEditCanvas.emit(expense);
  }

  emitExpenseToDelete(expense: Expense) {
    this.deleteExpense.emit(expense);
  }

  emitExpenseToBookmark(expense: Expense) {
    this.bookmarkExpense.emit(expense);
  }
}
