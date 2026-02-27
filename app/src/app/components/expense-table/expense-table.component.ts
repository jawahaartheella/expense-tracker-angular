import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';

import { Expense } from '../../core/models/expense.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-expense-table',
  imports: [NgClass],
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.css'
})
export class ExpenseTableComponent implements OnChanges{
  @Input() expenseData: Array<Expense> = [];
  @Input() categories?: Array<Category>;
  @Input() showNotesOptions: boolean = false;
  @Input() isTableFixedLayout: boolean = false;
  @Input() enablePagination: boolean = false;

  @Output() emitExpense = new EventEmitter<Expense>;
  @Output() openEditCanvas = new EventEmitter<Expense>;
  @Output() deleteExpense = new EventEmitter<Expense>;
  @Output() bookmarkExpense = new EventEmitter<Expense>;

  paginatedExpenses: Array<Expense> = [];
  pageSize!: number;
  startCount!: number;
  endCount!: number;
  totalCount!:number;

  ngOnChanges() {
    this.paginatedExpenses = this.expenseData;
    if(this.enablePagination) {
      this.initPagination();
    }
  }

  initPagination() {
    this.totalCount = this.expenseData?.length;
    this.pageSize = this.expenseData?.length >= 10 ? 10 : this.expenseData?.length;
    this.startCount = 0;
    this.endCount = this.expenseData?.length ? this.pageSize : 0;
    this.paginatedExpenses = this.expenseData?.slice(this.startCount, this.endCount);
  }

  loadPreviousExpenses() {
    this.startCount = this.startCount - this.pageSize;
    this.endCount = this.startCount + this.pageSize;
    this.paginatedExpenses = this.expenseData?.slice(this.startCount, this.endCount);
  }

  loadNextExpenses() {
    this.startCount = this.startCount + this.pageSize;
    const nextCount = this.endCount + this.pageSize;
    this.endCount = !(nextCount > this.totalCount) ? nextCount : this.expenseData.length;
    this.paginatedExpenses = this.expenseData?.slice(this.startCount, this.endCount);
  }

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
