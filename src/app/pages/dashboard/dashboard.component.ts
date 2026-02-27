import { Component, OnInit } from '@angular/core';
import { ExpenseTableComponent } from '../../components/expense-table/expense-table.component';
import { Expense } from '../../core/models/expense.model';
import { Category } from '../../core/models/category.model';
import { forkJoin } from 'rxjs';
import { ExpenseService } from '../../core/services/expense.service';
import { CategoriesService } from '../../core/services/categories.service';
import { TooltipDirective } from '../../core/directives/tooltip/tooltip.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [ExpenseTableComponent, TooltipDirective, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  expensesList: Array<Expense> = [];
  recentExpenses: Array<Expense> = [];
  categoriesList: Array<Category> = [];
  recentCategoriesList: Array<Category> = [];

  currentMonth!: string;
  currentYear!: number;

  top5Categories: {
    categoryId: number | undefined,
    categoryName: string | undefined,
    total: number,
    height: number,
    colorCode: string | undefined
  }[] = [];

  constructor(private expenseService: ExpenseService,
    private categoryService: CategoriesService
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    forkJoin([this.expenseService.getAllExpenses(), this.categoryService.getCategories()]).subscribe({
      next: (res) => {
        const expenses = res[0].slice().reverse();
        this.expensesList = [...expenses];
        this.recentExpenses = expenses.splice(0,5);
        this.categoriesList = res[1];
        this.top5Categories = this.calculateBarData(this.expensesList)
      }
    });
  }

  getCategoryTotals(expenses: Expense[]) {
    let map = new Map<string, number>();

    this.categoriesList.forEach(cat => {
      map.set(String(cat.id), 0);
    });

    expenses.forEach(exp => {
      const key = String(exp.category);
      const current = map.get(key) ?? 0;
      map.set(key, (current + exp.amount));
    });

    return Array.from(map.entries()).map(([category, total]) => ({
      category,
      total
    }));
  }

  getTop5Categories(expenses: Expense[]) {
    return this.getCategoryTotals(expenses)
              .sort((a,b) => b.total- a.total)
              .splice(0,5);
  }

  calculateBarData(expenses: Expense[]) {
    const topCategories = this.getTop5Categories(expenses);

    const maxTotal= Math.max(...topCategories.map(c => c.total));

    return topCategories.map(c => ({
      categoryId: this.getCategoryDetails(c.category)?.id,
      categoryName: this.getCategoryDetails(c.category)?.name,
      total: c.total,
      height: !Math.round((c.total/maxTotal) * 100) ? 1 : Math.round((c.total/maxTotal) * 100) ,
      colorCode: this.getCategoryDetails(c.category)?.colorCode
    }));
  }

  getCategoryDetails(expenseId: string) {
    return this.categoriesList.find(c => c.id == parseInt(expenseId));
  } 

  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month-1, day);
  }

  getCurrentMonthTotal() {
    const today = new Date();
    const month = today.getMonth();
    this.currentMonth = today.toLocaleString('default', {month: 'long'});
    this.currentYear = today.getFullYear();

    let filteredExpenses = this.expensesList.filter(exp => {
      const expenseDate= this.parseDate(exp.date);
      return(
        expenseDate.getMonth() === month && 
        expenseDate.getFullYear() === this.currentYear &&
        expenseDate <= today
      )
    });

    const totalSpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return totalSpent;
  }
}
