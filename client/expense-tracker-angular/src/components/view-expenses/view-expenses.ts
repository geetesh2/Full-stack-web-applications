import { Component, Input, OnInit } from '@angular/core';
import { Expense } from '../../models/expense.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle,  } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-view-expenses',
  imports: [DatePipe, MatCardContent, MatCardTitle, MatCard, CommonModule, MatIcon],
  templateUrl: './view-expenses.html',
  styleUrl: './view-expenses.css'
})
export class ViewExpenses implements OnInit {
    @Input() expenses: Expense[] = []; // Ideally use a model/interface
    ngOnInit(): void {
  this.expenses = [
    {
      expenseType: 'Food',
      amount: 250,
      description: 'Lunch at cafe',
      date: new Date('2025-06-30')
    },
    {
      expenseType: 'Travel',
      amount: 1200,
      description: 'Cab to airport',
      date: new Date('2025-06-28')
    },
    {
      expenseType: 'Shopping',
      amount: 4000,
      description: 'Bought a new smartwatch',
      date: new Date('2025-06-25')
    },
    {
      expenseType: 'Others',
      amount: 300,
      description: 'Gift for friend',
      date: new Date('2025-06-20')
    }
  ];
}

onEdit(expense: Expense) {
  console.log('Edit clicked:', expense);
  // Trigger edit logic or emit to parent
}

onDelete(expense: Expense) {
  console.log('Delete clicked:', expense);
  // Trigger delete logic or emit to parent
}

}
