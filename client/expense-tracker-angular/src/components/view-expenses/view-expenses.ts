import { Component, inject, Input, OnInit } from '@angular/core';
import { ExpenseDto } from '../../models/expense.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle,  } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ExpenseService } from '../../services/expense-service';
import { Expense } from '../../models/expenseResponse.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-expenses',
  imports: [DatePipe, MatCardContent, MatCardTitle, MatCard, CommonModule, MatIcon],
  templateUrl: './view-expenses.html',
  styleUrl: './view-expenses.css'
})
export class ViewExpenses implements OnInit {
     expenses: Expense[] = []; // Ideally use a model/interface
        private expenseService = inject(ExpenseService);
        private router = inject(Router);

    ngOnInit(): void {
  this.expenseService.expenses$.subscribe(expenses => {
    this.expenses = expenses;
  })
}

onEdit(expense: Expense) {
  this.router.navigateByUrl(`/edit-expense/${expense.id}`)
}

onDelete(expense: Expense) {
  this.expenseService.deleteExpense(expense.id).subscribe(() => {
    
  });
  // Trigger delete logic or emit to parent
}

}
