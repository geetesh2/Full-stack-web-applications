import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Expense } from '../../models/expenseResponse.model';
import { ExpenseService } from '../../services/expense-service';

@Component({
  standalone: true,
  selector: 'app-view-expenses',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid p-3 p-md-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="mb-0 text-white fw-bold">All Expenses</h1>
          <p class="text-white-50">Filter and manage your recorded expenses.</p>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="card filter-card mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-md">
              <label for="month" class="form-label">Month</label>
              <select
                id="month"
                class="form-select"
                [(ngModel)]="selectedMonth"
                (change)="applyFilter()"
              >
                <option [ngValue]="''">All Months</option>
                <option *ngFor="let m of months; let i = index" [value]="i + 1">
                  {{ m }}
                </option>
              </select>
            </div>
            <div class="col-md">
              <label for="year" class="form-label">Year</label>
              <select
                id="year"
                class="form-select"
                [(ngModel)]="selectedYear"
                (change)="applyFilter()"
              >
                <option [ngValue]="''">All Years</option>
                <option *ngFor="let y of years" [value]="y">{{ y }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Expense Cards Grid -->
      <ng-container *ngIf="filteredExpenses.length > 0; else noData">
        <div class="row g-4">
          <div
            *ngFor="let expense of filteredExpenses"
            class="col-md-6 col-lg-4"
          >
            <div class="card expense-card h-100">
              <div
                class="card-header d-flex justify-content-between align-items-center"
              >
                <h5 class="card-title mb-0">{{ expense.expenseType }}</h5>
                <div>
                  <button class="btn btn-sm btn-icon" (click)="onEdit(expense)">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-icon text-danger"
                    (click)="onDelete(expense)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <h3 class="amount mb-3">
                  ₹{{ expense.amount.toLocaleString('en-IN') }}
                </h3>
                <p class="description mb-2">
                  {{ expense.description || 'No description' }}
                </p>
                <small class="text-white-50">{{
                  expense.date | date : 'fullDate'
                }}</small>
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- No Data / Empty State Template -->
      <ng-template #noData>
        <div class="text-center empty-state">
          <i class="fas fa-search-dollar fa-4x mb-4"></i>
          <h3 class="text-white fw-bold">No Expenses Found</h3>
          <p class="text-white-50">
            Try adjusting your filters or add a new expense.
          </p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .container-fluid {
        height: 100%;
        overflow-y: auto;
      }

      .card {
        background-color: #1a1a1a;
        border: 1px solid #333;
        border-radius: 1rem;
        color: #e0e0e0;
      }

      .filter-card {
        background-color: rgba(38, 38, 38, 0.8);
      }

      .form-label {
        font-weight: 500;
        color: #adb5bd;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }

      .form-select {
        background-color: #2c2c2c;
        border-color: #444;
        color: #e0e0e0;
      }
      .form-select:focus {
        background-color: #2c2c2c;
        border-color: #6a11cb;
        color: #e0e0e0;
        box-shadow: 0 0 0 0.25rem rgba(106, 17, 203, 0.25);
      }

      .expense-card {
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      }
      .expense-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      }

      .expense-card .card-header {
        background-color: #222;
        border-bottom: 1px solid #333;
      }
      .expense-card .card-title {
        color: #fff;
        font-weight: 600;
      }
      .expense-card .amount {
        font-weight: 700;
        color: #fff;
      }
      .expense-card .description {
        color: #adb5bd;
        min-height: 40px; /* Ensures consistent card height */
      }

      .btn-icon {
        color: #adb5bd;
        background-color: transparent;
        border: none;
      }
      .btn-icon:hover {
        color: #fff;
      }

      .empty-state {
        padding: 4rem 0;
        color: rgba(255, 255, 255, 0.3);
      }
    `,
  ],
})
export class ViewExpenses implements OnInit, OnDestroy {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];

  selectedMonth: number | '' = '';
  selectedYear: number | '' = '';

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  years: number[] = [];

  private expenseService = inject(ExpenseService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.populateYears();
    this.expenseService.expenses$.subscribe((expenses) => {
      this.expenses = expenses;
      console.log(this.expenses);
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  populateYears(): void {
    const currentYear = new Date().getFullYear();
    const startYear = 2022;
    for (let i = currentYear; i >= startYear; i--) {
      this.years.push(i);
    }
  }

  applyFilter(): void {
    let filtered = this.expenses;

    if (this.selectedMonth) {
      filtered = filtered.filter(
        (exp) =>
          new Date(exp.date).getMonth() + 1 === Number(this.selectedMonth)
      );
    }

    if (this.selectedYear) {
      filtered = filtered.filter(
        (exp) => new Date(exp.date).getFullYear() === Number(this.selectedYear)
      );
    }

    this.filteredExpenses = filtered;
  }

  onEdit(expense: Expense): void {
    this.router.navigate(['/edit-expense', expense.id]);
  }

  onDelete(expense: Expense): void {
    // In a real app, you'd show a confirmation modal first
    this.expenseService.deleteExpense(expense.id).subscribe(() => {
      this.expenses = this.expenses.filter((e) => e.id !== expense.id);
      this.applyFilter();
    });
  }
}
