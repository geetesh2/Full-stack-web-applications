import { Component, inject, OnInit } from '@angular/core';
import { ExpenseDto } from '../../models/expense.model';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Expense } from '../../models/expenseResponse.model';
import { ExpenseService } from '../../services/expense-service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.html',
  styleUrls: ['./summary.css'],
  standalone: true,
  imports:[MatCard, MatIcon]
})
export class SummaryComponent implements OnInit {
  expenses: Expense[] = [ ];
  private expenseService: ExpenseService = inject(ExpenseService);
  totalExpense = 0;
  topCategory = '';
  totalEntries = 0;
  averageDailySpend = 0;

  ngOnInit(): void {
    this.expenseService.expenses$.subscribe((val) => {
      this.expenses = val;
      this.calculateSummary();
    })
  }

  calculateSummary() {
    this.totalEntries = 0;
    this.totalExpense = 0;
    const categoryTotals: { [key: string]: number } = {};
    const datesSet = new Set<string>();

    for (const exp of this.expenses) {
      this.totalExpense += exp.amount;
      this.totalEntries += 1;

      categoryTotals[exp.expenseType!] = (categoryTotals[exp.expenseType!] || 0) + exp.amount;

      const dateStr = new Date(exp.date).toDateString();
      datesSet.add(dateStr);
    }

    let max = 0;
    for (const [key, val] of Object.entries(categoryTotals)) {
      if (val > max) {
        max = val;
        this.topCategory = key;
      }
    }

    const uniqueDays = datesSet.size;
    this.averageDailySpend = uniqueDays ? Math.round(this.totalExpense / uniqueDays) : this.totalExpense;
  }
}
