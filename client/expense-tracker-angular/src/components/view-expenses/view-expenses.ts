import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Expense } from '../../models/expenseResponse.model';
import { ExpenseService } from '../../services/expense-service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-view-expenses',
  imports: [
    CommonModule,
    DatePipe,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatIcon,
    FormsModule,
  ],
  templateUrl: './view-expenses.html',
  styleUrl: './view-expenses.css',
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

    this.expenseService.expenses$
      .pipe(takeUntil(this.destroy$))
      .subscribe((expenses) => {
        this.expenses = expenses;
        this.applyFilter();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  populateYears(): void {
    const currentYear = new Date().getFullYear();
    const startYear = 2022; // Customize this as needed
    this.years = Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => currentYear - i
    );
  }

  applyFilter(): void {
    this.filteredExpenses = this.expenses.filter((exp) => {
      const date = new Date(exp.date);
      console.log(date, date.getMonth(), date.getFullYear(), this.selectedMonth);
      let matchesMonth = this.selectedMonth
        ? date.getMonth() + 1 == this.selectedMonth
        : true;
      if(this.selectedMonth == ''){
        matchesMonth = true;
      }
      let matchesYear = this.selectedYear
        ? date.getFullYear() == this.selectedYear
        : true;
        if (this.selectedYear == '') {
          matchesYear = true;
        }
        console.log(matchesMonth, matchesYear);

      return matchesMonth && matchesYear;
    });
  }

  onEdit(expense: Expense): void {
    this.router.navigateByUrl(`/edit-expense/${expense.id}`);
  }

  onDelete(expense: Expense): void {
    this.expenseService.deleteExpense(expense.id).subscribe(() => {
      this.expenses = this.expenses.filter((e) => e.id !== expense.id);
      this.applyFilter(); // Update filtered list
    });
  }
}
