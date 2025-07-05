import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ExpenseService } from '../../services/expense-service';
import { ExpenseDto } from '../../models/expense.model';
import { ActivatedRoute } from '@angular/router';
import { Expense } from '../../models/expenseResponse.model';

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
export class ExpenseForm implements OnInit {
  myForm: FormGroup;
  private expenseService = inject(ExpenseService);
  mode = 'create';
  expenseToEdit:any;
  constructor(private fb: FormBuilder,   private route: ActivatedRoute,) {
    this.myForm = this.fb.group({
      amount: ['', Validators.required],
      expenseType: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode = 'edit';
      this.expenseService.getExpense(id).subscribe(expense => {
        this.expenseToEdit = expense;
        const dateOnly = new Date(expense.date).toISOString().split('T')[0];
        this.myForm.patchValue({
          amount: expense.amount,
          expenseType: expense.expenseType,
          description: expense.description,
          date: dateOnly
        });
      });
    } else {
      this.mode = 'create';
    }
  }

  onSubmit() {
    if (this.myForm.valid) {
      const expense: ExpenseDto = this.myForm.value;
      console.log('Submitted Expense:', expense);

      if(this.mode === 'create'){
        this.expenseService.createExpense(expense).subscribe((value) => {
        console.log(value);
      });
      }

    if (this.mode === 'edit' && this.expenseToEdit) {
      console.log(this.expenseToEdit.id);
      this.expenseService.updateExpense(this.expenseToEdit.id, expense).subscribe((value) => {
                console.log(value);
      });
    }
      
    }

    
  }
}
