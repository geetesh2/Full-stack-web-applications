import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExpenseService } from '../../services/expense-service';
import { ExpenseDto } from '../../models/expense.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="form-page-container">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-10">
            <div class="form-wrapper">
              <div class="text-center mb-4">
                <h1 class="form-title mb-1">
                  {{ mode === 'edit' ? 'Edit Expense' : 'Add New Expense' }}
                </h1>
                <p class="text-white-50">Please fill out the details below.</p>
              </div>

              <form
                [formGroup]="myForm"
                (ngSubmit)="onSubmit()"
                id="expenseForm"
                novalidate
              >
                <!-- Amount -->
                <div class="input-group input-group-lg mb-3">
                  <span class="input-group-text">₹</span>
                  <div class="form-floating flex-grow-1">
                    <input
                      type="number"
                      class="form-control"
                      id="amount"
                      placeholder="Amount"
                      formControlName="amount"
                      [class.is-invalid]="
                        myForm.get('amount')?.invalid &&
                        myForm.get('amount')?.touched
                      "
                    />
                    <label for="amount">Amount</label>
                  </div>
                </div>

                <!-- Expense Category Dropdown -->
                <div class="form-floating mb-3">
                  <select
                    class="form-select"
                    id="expenseType"
                    formControlName="expenseType"
                    [class.is-invalid]="
                      myForm.get('expenseType')?.invalid &&
                      myForm.get('expenseType')?.touched
                    "
                  >
                    <option [ngValue]="null" disabled>Select a category</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Rent">Rent</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Health">Health</option>
                    <option value="Other">Other</option>
                  </select>
                  <label for="expenseType">Expense Category</label>
                </div>

                <!-- Description -->
                <div class="form-floating mb-3">
                  <textarea
                    class="form-control"
                    id="description"
                    placeholder="Description"
                    formControlName="description"
                    style="height: 100px"
                  ></textarea>
                  <label for="description">Description (Optional)</label>
                </div>

                <!-- Date -->
                <div class="form-floating mb-3">
                  <input
                    type="date"
                    class="form-control"
                    id="date"
                    placeholder="Date"
                    formControlName="date"
                    [class.is-invalid]="
                      myForm.get('date')?.invalid && myForm.get('date')?.touched
                    "
                  />
                  <label for="date">Date</label>
                </div>

                <!-- Action Buttons -->
                <div class="d-grid gap-2 d-sm-flex justify-content-sm-end mt-4">
                  <button
                    type="button"
                    class="btn btn-secondary btn-lg"
                    routerLink="/home"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg"
                    [disabled]="!myForm.valid"
                  >
                    {{ mode === 'edit' ? 'Save Changes' : 'Submit Expense' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .form-page-container {
        background-color: #121212;
        /* Adjusted padding to account for fixed header and footer */
        padding: 6rem 1rem;
        width: 100%;
        color: #e0e0e0;
        /* The parent .router-outlet-wrapper handles height and scrolling */
      }

      .form-wrapper {
        background-color: rgba(38, 38, 38, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      }

      .form-title {
        font-weight: 700;
        color: #ffffff;
      }

      /* Custom styles for Bootstrap form controls in dark theme */
      .form-control,
      .form-select {
        background-color: #2c2c2c;
        border-color: #444;
        color: #e0e0e0;
        padding: 1rem;
      }

      .form-control:-webkit-autofill,
      .form-control:-webkit-autofill:hover,
      .form-control:-webkit-autofill:focus,
      .form-control:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px #2c2c2c inset !important;
        -webkit-text-fill-color: #e0e0e0 !important;
      }

      .form-control:focus,
      .form-select:focus {
        background-color: #2c2c2c;
        border-color: #6a11cb;
        color: #e0e0e0;
        box-shadow: 0 0 0 0.25rem rgba(106, 17, 203, 0.25);
      }

      .form-floating > label {
        color: #888;
      }

      .form-floating > .form-control:focus ~ label,
      .form-floating > .form-control:not(:placeholder-shown) ~ label,
      .form-floating > .form-select ~ label {
        color: #6a11cb;
      }

      .form-select {
        padding-top: 1.625rem;
        padding-bottom: 0.625rem;
      }

      .input-group-text {
        background-color: #2c2c2c;
        border-color: #444;
        color: #e0e0e0;
        font-size: 1.25rem;
        font-weight: 500;
      }

      .input-group .form-control {
        border-left: none;
      }

      .input-group:focus-within .input-group-text {
        border-color: #6a11cb;
      }

      .btn-primary {
        background-color: #6a11cb;
        border-color: #6a11cb;
        font-weight: 600;
        transition: background-color 0.2s ease-in-out;
      }

      .btn-primary:hover,
      .btn-primary:focus {
        background-color: #5e0fa8;
        border-color: #5e0fa8;
      }

      .btn-primary:disabled {
        background-color: #3a2951;
        border-color: #3a2951;
      }

      .btn-secondary {
        background-color: #444;
        border-color: #444;
        font-weight: 600;
      }

      .btn-secondary:hover {
        background-color: #555;
        border-color: #555;
      }
    `,
  ],
})
export class ExpenseFormComponent implements OnInit {
  myForm: FormGroup;
  mode = 'create';
  private expenseId: string | null = null;

  private expenseService = inject(ExpenseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  constructor() {
    this.myForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      expenseType: [null, Validators.required],
      description: [''],
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.expenseId = this.route.snapshot.paramMap.get('id');

    if (this.expenseId) {
      this.mode = 'edit';
      this.expenseService.getExpense(this.expenseId).subscribe((expense) => {
        const dateOnly = new Date(expense.date).toISOString().split('T')[0];
        this.myForm.patchValue({
          ...expense,
          date: dateOnly,
        });
      });
    } else {
      this.mode = 'create';
      this.myForm.patchValue({ date: new Date().toISOString().split('T')[0] });
    }
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); // Trigger validation messages
      return;
    }

    const expense: ExpenseDto = this.myForm.value;

    const operation =
      this.mode === 'edit' && this.expenseId
        ? this.expenseService.updateExpense(this.expenseId, expense)
        : this.expenseService.createExpense(expense);

    // operation.subscribe({
    //   next: () => this.router.navigate(['/home']),
    //   error: (err) => console.error('Failed to save expense:', err),
    // });
  }
}
