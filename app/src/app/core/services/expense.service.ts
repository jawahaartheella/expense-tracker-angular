import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService extends ApiService{

  constructor(http: HttpClient) { 
    super(http);
  }

  getAllExpenses(): Observable<Expense[]> {
    return this.get<Expense[]>(`/expenses`);
  }

  addExpense(expense: Expense): Observable<Expense> {
    return this.post(`/expenses`, expense);
  }

  editExpense(expenseId: number, expense: Expense): Observable<Expense> {
    return this.put(`/expenses/${expenseId}`, expense);
  }

  deleteExpense(expenseId: number): Observable<Expense> {
    return this.delete(`/expenses/${expenseId}`);
  }
}
