import { Component, OnInit } from '@angular/core';
import { ExpenseDto } from '../../models/expense.model';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.html',
  styleUrls: ['./summary.css'],
  standalone: true,
  imports:[MatCard, MatIcon]
})
export class SummaryComponent implements OnInit {
  expenses: ExpenseDto[] = [
    { expenseType: 'Food', amount: 250, description: 'Lunch', date: new Date('2025-07-01') },
    { expenseType: 'Travel', amount: 800, description: 'Cab', date: new Date('2025-07-01') },
    { expenseType: 'Shopping', amount: 1200, description: 'Shoes', date: new Date('2025-06-30') },
    { expenseType: 'Food', amount: 300, description: 'Grocery', date: new Date('2025-06-29') },
    { expenseType: 'Others', amount: 150, description: 'Pen', date: new Date('2025-06-28') },
    { expenseType: 'Travel', amount: 400, description: 'Metro', date: new Date('2025-06-27') },
    { expenseType: 'Shopping', amount: 2200, description: 'Clothes', date: new Date('2025-06-26') },
    { expenseType: 'Food', amount: 100, description: 'Snacks', date: new Date('2025-06-25') }
  ];

  totalExpense = 0;
  topCategory = '';
  totalEntries = 0;
  averageDailySpend = 0;

  ngOnInit(): void {
    this.calculateSummary();
  }

  calculateSummary() {
    const categoryTotals: { [key: string]: number } = {};
    const datesSet = new Set<string>();

    for (const exp of this.expenses) {
      this.totalExpense += exp.amount;
      this.totalEntries += 1;

      categoryTotals[exp.expenseType] = (categoryTotals[exp.expenseType] || 0) + exp.amount;

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
