import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { CategoriesComponent } from './pages/categories/categories.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'expenses', component: ExpensesComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
