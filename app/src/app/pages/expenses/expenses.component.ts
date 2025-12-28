import { Component } from '@angular/core';
import { FiltersComponent } from '../../components/filters/filters.component';
import { ExpenseTableComponent } from '../../components/expense-table/expense-table.component';

@Component({
  selector: 'app-expenses',
  imports: [FiltersComponent, ExpenseTableComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {
  expenseData = [{
    id: 1,
    title: 'Electric Bill',
    date: '01/10/2024',
    category: 'Utilities',
    amount: 150.00,
    notes: 'Monthly bill',
    isBookmarked: true
  }];
}
