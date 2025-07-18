import { Routes } from '@angular/router';
import { ExpenseForm } from '../components/expense-form/expense-form';
import { ChartComponent } from '../components/chart/chart';
import { ViewExpenses } from '../components/view-expenses/view-expenses';
import { AuthComponent } from '../components/auth/auth';
import { authGuard } from '../AuthGuard/auth-guard';
import { Home } from '../components/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent},
  { path: 'home', component: Home, canActivate:[authGuard] },
  { path: 'add-expense', component: ExpenseForm, canActivate: [authGuard] },
  { path: 'view-expenses', component: ViewExpenses, canActivate: [authGuard] },
  { path: 'edit-expense/:id', component: ExpenseForm, canActivate: [authGuard] },
];
