import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {BudgetService } from '../../services/budget-service';
import { BudgetResponse } from '../../models/budgetResponse.model';
import { BudgetDto } from '../../models/budget.model';

// import { BudgetService } from '../../services/budget.service'; // You will need to create this service

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './budgets.html',
  styleUrl: './budgets.css'
})
export class Budgets implements OnInit {
  // This is mock data. You should replace this with a call to your BudgetService.
  budgets: BudgetDto[] =   []
  // Uncomment these when your service is ready
  private budgetService = inject(BudgetService);
  private router = inject(Router);

  ngOnInit(): void {
    this.budgetService.budgets$.subscribe(data => {
      this.budgets = data; // Ensure budgets is always an array
      console.log('Fetched budgets:', data);
    });
    this.budgetService.getMyBudgets();
    
  }

  /**
   * Navigates to the form for adding a new budget.
   */
  navigateToAddBudget(): void {
    this.router.navigate(['/add-budget']);
  }

  /**
   * Handles the edit action for a budget item.
   * @param budget - The budget object to be edited.
   */
  onEdit(budget: BudgetDto): void {
    console.log('Editing budget:', budget);
  }

  /**
   * Handles the delete action for a budget item.
   * @param budget - The budget object to be deleted.
   */
  onDelete(budget: BudgetDto): void {
    // 2. Call your service to delete the budget from the backend
    // this.budgetService.deleteBudget(budget).subscribe(() => {
    //   this.budgets = this.budgets.filter(b => b !== budget);
    // });
    // console.log('Deleting budget:', budget);
    // // Remove from the local array for now
    // this.budgets = this.budgets.filter(b => b !== budget);
  }

  /**
   * Helper function to get the month name from a number.
   * In a real app, this should be an Angular Pipe for reusability.
   * @param monthNumber - The number of the month (1-12).
   * @returns The full name of the month.
   */
  getMonthName(monthNumber: number): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1] || '';
  }
}
