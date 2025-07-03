import { Routes } from '@angular/router';
import { ExpenseForm } from '../components/expense-form/expense-form';
import { ChartComponent } from '../components/chart/chart';
import { ViewExpenses } from '../components/view-expenses/view-expenses';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ChartComponent },
  { path: 'add-expense', component: ExpenseForm },
  { path: 'view-expenses', component: ViewExpenses },
];
