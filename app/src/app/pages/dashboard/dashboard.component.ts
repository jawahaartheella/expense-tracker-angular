import { Component } from '@angular/core';
import { ExpenseTableComponent } from '../../components/expense-table/expense-table.component';

@Component({
  selector: 'app-dashboard',
  imports: [ExpenseTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
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
