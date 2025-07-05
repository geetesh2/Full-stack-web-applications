import { Component, inject, Input, OnInit } from '@angular/core';
import { ExpenseDto } from '../../models/expense.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle,  } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ExpenseService } from '../../services/expense-service';
import { Expense } from '../../models/expenseResponse.model';

@Component({
  selector: 'app-view-expenses',
  imports: [DatePipe, MatCardContent, MatCardTitle, MatCard, CommonModule, MatIcon],
  templateUrl: './view-expenses.html',
  styleUrl: './view-expenses.css'
})
export class ViewExpenses implements OnInit {
     expenses: Expense[] = []; // Ideally use a model/interface
        private expenseService = inject(ExpenseService);

    ngOnInit(): void {
  this.expenseService.expenses$.subscribe(expenses => {
    this.expenses = expenses;
  })
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
