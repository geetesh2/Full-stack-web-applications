import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// NOTE: You will need to create these components or integrate their logic here.
// For now, this component is self-contained with mock data.
// import { ExpenseChartComponent } from '../expense-chart/expense-chart.component';
// import { ExpenseSummaryComponent } from '../expense-summary/expense-summary.component';
import { ExpenseService } from '../../services/expense-service';
import { Expense } from '../../models/expenseResponse.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Main container with padding -->
    <div class="home-container container-fluid p-3 p-md-4">
      <!-- This is the main view when there are expenses -->
      <ng-container *ngIf="expenses.length > 0; else emptyState">
        <!-- Header Row -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="mb-0 text-white fw-bold">Dashboard</h1>
            <p class="text-white-50">
              Here's your spending summary for this month.
            </p>
          </div>
          <button
            class="btn btn-primary d-none d-md-inline-flex align-items-center gap-2"
            routerLink="/add-expense"
          >
            <i class="fas fa-plus"></i> Add Expense
          </button>
        </div>

        <!-- Main Grid Layout -->
        <div class="row g-4">
          <!-- Left Column: Transactions & Summary -->
          <div class="col-lg-8">
            <!-- Summary Cards -->
            <div class="row g-4 mb-4">
              <div class="col-md-6">
                <div class="card summary-card h-100">
                  <div class="card-body d-flex align-items-center">
                    <div
                      class="summary-icon bg-success bg-opacity-10 text-success"
                    >
                      <i class="fas fa-wallet"></i>
                    </div>
                    <div>
                      <p class="card-subtitle">Total Spent</p>
                      <h4 class="card-title">
                        ₹{{ totalSpent.toLocaleString('en-IN') }}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card summary-card h-100">
                  <div class="card-body d-flex align-items-center">
                    <div
                      class="summary-icon bg-danger bg-opacity-10 text-danger"
                    >
                      <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div>
                      <p class="card-subtitle">Highest Expense</p>
                      <h4 class="card-title">
                        ₹{{ highestExpense.toLocaleString('en-IN') }}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Transactions Table -->
            <div class="card data-card">
              <div class="card-header">
                <h5 class="card-title mb-0">Recent Transactions</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover align-middle">
                    <tbody>
                      <tr *ngFor="let expense of expenses.slice(0, 5)">
                        <td class="d-flex align-items-center">
                          <div
                            class="category-icon me-3"
                            [ngClass]="getCategoryClass(expense.expenseType!)"
                          >
                            <i
                              [class]="getCategoryIcon(expense.expenseType!)"
                            ></i>
                          </div>
                          <div>
                            <div class="fw-semibold">
                              {{ expense.description || expense.expenseType }}
                            </div>
                            <small class="text-white-50">{{
                              expense.date | date : 'mediumDate'
                            }}</small>
                          </div>
                        </td>
                        <td class="text-end fw-bold fs-6">
                          -₹{{ expense.amount.toLocaleString('en-IN') }}
                        </td>
                        <td class="text-end">
                          <button
                            class="btn btn-sm btn-icon"
                            [routerLink]="['/edit-expense', expense.id]"
                          >
                            <i class="fas fa-pen"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Budget & AI Insights -->
          <div class="col-lg-4">
            <!-- Budget Card -->
            <div class="card data-card mb-4">
              <div class="card-body">
                <div
                  class="d-flex justify-content-between align-items-center mb-2"
                >
                  <h5 class="card-title mb-0">Monthly Budget</h5>
                  <span
                    class="badge bg-primary bg-opacity-25 text-primary-emphasis"
                    >75% Used</span
                  >
                </div>
                <p class="text-white-50 mb-3">
                  You've spent ₹{{ totalSpent.toLocaleString('en-IN') }} of ₹{{
                    budget.toLocaleString('en-IN')
                  }}
                </p>
                <div class="progress" style="height: 10px;">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    style="width: 75%;"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>

            <!-- AI Insights Card -->
            <div class="card data-card">
              <div class="card-body">
                <h5 class="card-title mb-3">
                  <i class="fas fa-lightbulb me-2 text-warning"></i>AI Insights
                </h5>
                <div class="d-flex ai-insight-item mb-3">
                  <i class="fas fa-chart-line text-info fa-lg mt-1"></i>
                  <div>
                    <strong>Trending Up:</strong> Your spending on 'Dining Out'
                    is up by 15% compared to last month.
                  </div>
                </div>
                <div class="d-flex ai-insight-item">
                  <i class="fas fa-check-circle text-success fa-lg mt-1"></i>
                  <div>
                    <strong>Good Job!</strong> You are on track with your budget
                    this month. Keep it up!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- This is the empty state view when there are no expenses -->
      <ng-template #emptyState>
        <div
          class="d-flex flex-column align-items-center justify-content-center text-center empty-state-container"
        >
          <i class="fas fa-ghost empty-state-icon"></i>
          <h2 class="text-white fw-bold mt-4">It's a little empty here...</h2>
          <p class="text-white-50 col-md-6">
            Get started by adding your first expense. Tracking your spending is
            the first step to financial freedom!
          </p>
          <button class="btn btn-primary btn-lg mt-3" routerLink="/add-expense">
            <i class="fas fa-plus me-2"></i>
            Add Your First Expense
          </button>
        </div>
      </ng-template>

      <!-- Floating Action Button for Mobile -->
      <button
        class="btn btn-primary fab d-md-none"
        routerLink="/add-expense"
        aria-label="Add Expense"
      >
        <i class="fas fa-plus fa-lg"></i>
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .home-container {
        height: 100%;
        overflow-y: auto;
      }

      .card {
        background-color: #1a1a1a;
        border: 1px solid #333;
        border-radius: 1rem;
        color: #e0e0e0;
      }

      .card-header {
        background-color: #222;
        border-bottom: 1px solid #333;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
      }

      .card-title {
        color: #ffffff;
        font-weight: 600;
      }

      .summary-card .card-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: #fff;
      }

      .summary-card .card-subtitle {
        font-size: 0.9rem;
        color: #adb5bd;
        margin-bottom: 0.25rem;
      }

      .summary-icon {
        font-size: 1.5rem;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-right: 1rem;
      }

      .table {
        --bs-table-bg: transparent;
        --bs-table-striped-bg: rgba(255, 255, 255, 0.05);
        --bs-table-hover-bg: rgba(255, 255, 255, 0.07);
        --bs-table-color: #e0e0e0;
        border-color: #333;
      }

      .category-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        color: #fff;
      }

      .btn-icon {
        color: #adb5bd;
        background-color: transparent;
        border: none;
      }
      .btn-icon:hover {
        color: #fff;
      }

      .progress {
        background-color: #333;
      }
      .progress-bar {
        background-color: #6a11cb;
      }

      .ai-insight-item {
        gap: 1rem;
        align-items: flex-start;
      }

      .empty-state-container {
        height: 100%;
      }

      .empty-state-icon {
        font-size: 6rem;
        color: rgba(106, 27, 203, 0.4);
      }

      .fab {
        position: fixed;
        bottom: 70px; /* Above the main footer */
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
      }

      .btn-primary {
        background-color: #6a11cb;
        border-color: #6a11cb;
        font-weight: 600;
      }
      .btn-primary:hover {
        background-color: #5e0fa8;
        border-color: #5e0fa8;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  expenses: Expense[] = [];
  totalSpent = 0;
  highestExpense = 0;
  budget = 10000; 

  private expenseService = inject(ExpenseService);
  private router = inject(Router);

  ngOnInit(): void {
     this.expenseService.getMyExpenses();
    this.expenseService.expenses$
      .subscribe((expenses) => {
        this.expenses = expenses;
        this.calculateSummary();});
    this.calculateSummary();
  }

  calculateSummary() {
    if (this.expenses.length > 0) {
      this.totalSpent = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      this.highestExpense = Math.max(...this.expenses.map((exp) => exp.amount));
    }
  }

  // Helper functions for dynamic icons and colors
  getCategoryIcon(type: string): string {
    const icons: { [key: string]: string } = {
      Groceries: 'fas fa-shopping-cart',
      Entertainment: 'fas fa-film',
      'Dining Out': 'fas fa-utensils',
      Rent: 'fas fa-home',
      Transport: 'fas fa-gas-pump',
      Bills: 'fas fa-file-invoice-dollar',
      Health: 'fas fa-heartbeat',
      Shopping: 'fas fa-tshirt',
      Other: 'fas fa-ellipsis-h',
    };
    return icons[type] || 'fas fa-question-circle';
  }

  getCategoryClass(type: string): string {
    const colors: { [key: string]: string } = {
      Groceries: 'bg-primary',
      Entertainment: 'bg-danger',
      'Dining Out': 'bg-info',
      Rent: 'bg-success',
      Transport: 'bg-warning',
      Bills: 'bg-success',
      Health: 'bg-danger',
      Shopping: 'bg-primary',
      Other: 'bg-secondary',
    };
    return colors[type] || 'bg-secondary';
  }
}
