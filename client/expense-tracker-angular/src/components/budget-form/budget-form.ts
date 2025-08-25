import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BudgetDto } from '../../models/budget.model';
import { Observable } from 'rxjs';
import { BudgetService } from '../../services/budget-service';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.css'
})
export class BudgetForm implements OnInit {
  myForm: FormGroup;
  mode = 'create';
  private budgetId: string | null = null;
  duplicateBudgetError = false; // Property to track the duplicate error state

  months = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' },
    { value: 3, name: 'March' }, { value: 4, name: 'April' },
    { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' },
    { value: 9, name: 'September' }, { value: 10, name: 'October' },
    { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];
  years: number[] = [];

  private budgetService = inject(BudgetService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  constructor() {
    this.myForm = this.fb.group({
      LimitAmount: ['', [Validators.required, Validators.min(1)]],
      CategoryName: [null, Validators.required],
      Month: [null, Validators.required],
      Year: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.populateYears();
    // Fetch the latest budgets to ensure the duplicate check is accurate
    this.budgetService.getMyBudgets();

    // Logic for edit mode (can be implemented later)
    // this.budgetId = this.route.snapshot.paramMap.get('id');
    // if (this.budgetId) { this.mode = 'edit'; /* ...load data... */ }

    // Set default month and year
    const today = new Date();
    this.myForm.patchValue({
      Month: today.getMonth() + 1,
      Year: today.getFullYear()
    });
  }

  populateYears(): void {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    for (let i = currentYear + 2; i >= startYear; i--) {
      this.years.push(i);
    }
  }

  onSubmit() {
    // Reset the error on each submission attempt
    this.duplicateBudgetError = false;

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const newBudgetData: BudgetDto = this.myForm.value;

    // Get the current list of budgets from the service's BehaviorSubject
    const existingBudgets = this.budgetService.budgets$.getValue();

    // Check if a budget with the same category, month, and year already exists
    const isDuplicate = existingBudgets.some(
      b =>
        b.CategoryName === newBudgetData.CategoryName &&
        b.Month === newBudgetData.Month &&
        b.Year === newBudgetData.Year
    );

    // If it's a duplicate and we are in 'create' mode, show an error and stop
    if (isDuplicate && this.mode === 'create') {
      this.duplicateBudgetError = true;
      console.error('A budget for this category and month already exists.');
      return; // Stop the submission
    }

    // Proceed with creating or updating the budget
    const operation = this.mode === 'edit' && this.budgetId
      ? this.budgetService.updateBudget(this.budgetId, newBudgetData)
      : this.budgetService.createBudget(newBudgetData);

    (operation as Observable<any>).subscribe({
      next: () => this.router.navigate(['/view-budgets']), // Navigate to the main budget list
      error: (err) => console.error('Failed to save budget', err)
    });
  }
}
