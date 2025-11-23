import { Component, Input } from '@angular/core';
import { Expense } from '../../core/models/expense.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-expense-table',
  imports: [NgClass],
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.css'
})
export class ExpenseTableComponent {
  @Input() showNotesOptions: boolean = false;
  @Input() expenseData?: Array<Expense>;
  @Input() isTableFixedLayout: boolean = false;
}
