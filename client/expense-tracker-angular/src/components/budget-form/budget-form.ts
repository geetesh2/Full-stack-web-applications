import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { BudgetService } from '../../services/budget.service'; // Create this service
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
  mode = 'create'; // For now, we'll focus on create mode
  private budgetId: string | null = null; // For future edit functionality

  // Mock data for dropdowns
  months = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' },
    { value: 3, name: 'March' }, { value: 4, name: 'April' },
    { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' },
    { value: 9, name: 'September' }, { value: 10, name: 'October' },
    { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];
  years: number[] = [];

  private budgetService = inject(BudgetService); // Uncomment when service is ready
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
    // In a real app, you would check for an ID in the route to determine if you are editing
    // this.budgetId = this.route.snapshot.paramMap.get('id');
    // if (this.budgetId) {
    //   this.mode = 'edit';
    //   // Load budget data and patch the form
    // } else {
    //   this.mode = 'create';
    // }

    // Set default month and year to the current ones
    const today = new Date();
    this.myForm.patchValue({
      Month: today.getMonth() + 1,
      Year: today.getFullYear()
    });
  }

  /**
   * Populates the years array for the dropdown.
   */
  populateYears(): void {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2; // Go back 2 years
    for (let i = currentYear + 2; i >= startYear; i--) { // Go forward 2 years
      this.years.push(i);
    }
  }

  /**
   * Handles the form submission.
   */
  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); // Trigger validation messages
      return;
    }

    const budgetData: BudgetDto = this.myForm.value;

    console.log('Submitting budget data:', budgetData);
    // In a real app, you would call your service here:
    const operation = this.mode === 'edit' && this.budgetId
      ? this.budgetService.updateBudget(this.budgetId, budgetData)
      : this.budgetService.createBudget(budgetData);

     (operation  as Observable<any>).subscribe({
      next: () => this.router.navigate(['/view-budgets']),
      error: (err) => console.error('Failed to save budget', err)
    });

    // For now, just navigate back
    this.router.navigate(['/view-budgets']);
  }
}
