import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Expense } from '../../models/expenseResponse.model';
import { ExpenseService } from '../../services/expense-service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="summary-grid">
      <div class="row g-4">
        <!-- Total Expense Card -->
        <div class="col-md-6">
          <div class="card summary-card h-100">
            <div class="card-body d-flex align-items-center">
              <div class="summary-icon bg-primary bg-opacity-10 text-primary">
                <i class="fas fa-wallet"></i>
              </div>
              <div>
                <p class="card-subtitle">Total Expense</p>
                <h4 class="card-title">
                  ₹{{ totalExpense.toLocaleString('en-IN') }}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Category Card -->
        <div class="col-md-6">
          <div class="card summary-card h-100">
            <div class="card-body d-flex align-items-center">
              <div class="summary-icon bg-info bg-opacity-10 text-info">
                <i class="fas fa-star"></i>
              </div>
              <div>
                <p class="card-subtitle">Top Category</p>
                <h4 class="card-title">{{ topCategory || '-' }}</h4>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Entries Card -->
        <div class="col-md-6">
          <div class="card summary-card h-100">
            <div class="card-body d-flex align-items-center">
              <div class="summary-icon bg-success bg-opacity-10 text-success">
                <i class="fas fa-receipt"></i>
              </div>
              <div>
                <p class="card-subtitle">Total Entries</p>
                <h4 class="card-title">{{ totalEntries }}</h4>
              </div>
            </div>
          </div>
        </div>

        <!-- Average Daily Spend Card -->
        <div class="col-md-6">
          <div class="card summary-card h-100">
            <div class="card-body d-flex align-items-center">
              <div class="summary-icon bg-warning bg-opacity-10 text-warning">
                <i class="fas fa-calendar-day"></i>
              </div>
              <div>
                <p class="card-subtitle">Avg. Daily Spend</p>
                <h4 class="card-title">
                  ₹{{ averageDailySpend.toLocaleString('en-IN') }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .summary-card {
        background-color: #1a1a1a;
        border: 1px solid #333;
        border-radius: 1rem;
        color: #e0e0e0;
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      }
      .summary-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
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

      .card-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #fff;
        margin: 0;
      }

      .card-subtitle {
        font-size: 0.9rem;
        color: #adb5bd;
        margin-bottom: 0.25rem;
      }
    `,
  ],
})
export class SummaryComponent implements OnInit, OnDestroy {
  expenses: Expense[] = [];
  totalExpense = 0;
  topCategory = '';
  totalEntries = 0;
  averageDailySpend = 0;

  private expenseService = inject(ExpenseService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.expenseService.expenses$
      .subscribe((val) => {
        this.expenses = val;
        this.calculateSummary();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateSummary() {
    if (!this.expenses || this.expenses.length === 0) {
      this.totalExpense = 0;
      this.topCategory = '-';
      this.totalEntries = 0;
      this.averageDailySpend = 0;
      return;
    }

    this.totalExpense = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    this.totalEntries = this.expenses.length;

    const categoryTotals: { [key: string]: number } = this.expenses.reduce(
      (acc, exp) => {
        acc[exp.expenseType!] = (acc[exp.expenseType!] || 0) + exp.amount;
        return acc;
      },
      {} as { [key: string]: number }
    );

    this.topCategory = Object.keys(categoryTotals).reduce(
      (a, b) => (categoryTotals[a] > categoryTotals[b] ? a : b),
      ''
    );

    const datesSet = new Set(
      this.expenses.map((exp) => new Date(exp.date).toDateString())
    );
    const uniqueDays = datesSet.size;
    this.averageDailySpend =
      uniqueDays > 0 ? Math.round(this.totalExpense / uniqueDays) : 0;
  }
}
