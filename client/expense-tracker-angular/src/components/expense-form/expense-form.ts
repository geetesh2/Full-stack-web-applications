import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ExpenseService } from '../../services/expense-service';
import { ExpenseDto } from '../../models/expense.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './expense-form.html',
  styleUrls: ['./expense-form.css']
})
export class ExpenseForm {
  myForm: FormGroup;
  private expenseService = inject(ExpenseService);

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      amount: ['', Validators.required],
      expenseType: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      const expense:ExpenseDto = this.myForm.value;
      console.log('Submitted Expense:', expense);
      this.expenseService.createExpense(expense).subscribe((value) => {
      console.log(value);
    });
    }
  }
}
