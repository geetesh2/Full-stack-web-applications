import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ExpenseService } from '../../services/expense-service';
import { Expense } from '../../models/expenseResponse.model';
import { BudgetService } from '../../services/budget-service';
import { BudgetDto } from '../../models/budget.model';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html', // Using templateUrl
  styleUrl: './home.css' // Using styleUrl
})
export class HomeComponent implements OnInit {
  // --- Component Properties ---

  // Expense-related data
  allExpenses: Expense[] = [];
  totalSpentThisMonth = 0;
  highestExpenseThisMonth = 0;
  recentTransactions: Expense[] = [];

  // Budget-related data
  allBudgets: BudgetDto[] = [];
  totalBudgetForMonth = 0;
  expenditurePercentage = 0;

  // --- Injected Services ---
  private expenseService = inject(ExpenseService);
  private budgetService = inject(BudgetService);
  private router = inject(Router);

  ngOnInit(): void {
    // Fetch initial data from both services
    this.expenseService.getMyExpenses();
    this.budgetService.getMyBudgets();

    // Use combineLatest to react to changes from either expenses or budgets streams
    combineLatest([
      this.expenseService.expenses$,
      this.budgetService.budgets$
    ]).subscribe(([expenses, budgets]) => {
      this.allExpenses = expenses;
      console.log('Fetched Expenses:', this.allExpenses);
      this.allBudgets = budgets as BudgetDto[]; // Cast to Budget interface
      this.calculateMonthlySummary();
    });
  }

  /**
   * Calculates all summary data based on the current month's expenses and budgets.
   */
  calculateMonthlySummary(): void {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JS months are 0-indexed
    const currentYear = today.getFullYear();

    // Filter expenses for the current month
    const expensesThisMonth = this.allExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() + 1 === currentMonth && expDate.getFullYear() === currentYear;
    });

    // Filter budgets for the current month
    const budgetsThisMonth = this.allBudgets.filter(b =>
      b.Month === currentMonth && b.Year === currentYear
    );

    // Calculate summary figures
    this.totalSpentThisMonth = expensesThisMonth.reduce((sum, exp) => sum + exp.amount, 0);
    this.totalBudgetForMonth = budgetsThisMonth.reduce((sum, b) => sum + b.LimitAmount, 0);

    this.highestExpenseThisMonth = expensesThisMonth.length > 0
      ? Math.max(...expensesThisMonth.map(exp => exp.amount))
      : 0;

    // Calculate expenditure percentage, capping at 100% for the progress bar display logic
    if (this.totalBudgetForMonth > 0) {
      this.expenditurePercentage = Math.round((this.totalSpentThisMonth / this.totalBudgetForMonth) * 100);
    } else {
      this.expenditurePercentage = 0;
    }

    // Update the list of recent transactions
    this.recentTransactions = expensesThisMonth.slice(0, 5);
  }

  // --- Helper functions for dynamic icons and colors ---
  getCategoryIcon(type: string): string {
    const icons: { [key: string]: string } = {
      Food: 'fas fa-utensils',
      Travel: 'fas fa-plane',
      Shopping: 'fas fa-shopping-bag',
      Bills: 'fas fa-file-invoice-dollar',
      Rent: 'fas fa-home',
      Entertainment: 'fas fa-film',
      Health: 'fas fa-heartbeat',
      Other: 'fas fa-ellipsis-h',
    };
    console.log(type, icons[type]);
    return icons[type] || 'fas fa-question-circle';
  }

  getCategoryClass(type: string): string {
    const colors: { [key: string]: string } = {
      Food: 'bg-info',
      Travel: 'bg-warning',
      Shopping: 'bg-primary',
      Bills: 'bg-success',
      Rent: 'bg-secondary',
      Entertainment: 'bg-danger',
      Health: 'bg-danger',
      Other: 'bg-dark',
    };
    return colors[type] || 'bg-secondary';
  }
}
