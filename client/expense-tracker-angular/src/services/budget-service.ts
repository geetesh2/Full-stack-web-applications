import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BudgetDto } from '../models/budget.model';
import { BudgetResponse } from '../models/budgetResponse.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  // Base URL for the budget API endpoint. Adjust if your backend is different.
  private baseUrl = 'http://localhost:5555/api/budget';

  // BehaviorSubject to hold the list of budgets and notify subscribers of changes.
   budgets$ = new BehaviorSubject<BudgetDto[]>([]);


  constructor(private http: HttpClient) { }

  /**
   * Creates the authorization headers by retrieving the token from local storage.
   * @returns HttpHeaders object with the Authorization token.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Fetches all budgets for the currently authenticated user and updates the budgets$ stream.
   */
 getMyBudgets(): void {
    this.http
      // Allow the response to be a single object OR an array of objects
      .get<{ data: any[] }>(`${this.baseUrl}`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (response) => {
          console.log("Raw budget response:", response);


          const responseArray = response.data || [];

          const mappedBudgets: BudgetDto[] = responseArray.map(b => ({
            Id: b.id,
            CategoryName: b.category.name,
            LimitAmount: b.limitAmount,
            Month: b.month,
            Year: b.year
          }));
          this.budgets$.next(mappedBudgets);


        },
        error: (err) => {
          console.error("Failed to fetch budgets:", err);
          // On error, emit an empty array to prevent breaking the UI.
        }
      });
  }

  /**
   * Fetches a single budget by its unique ID.
   * @param id - The ID of the budget to retrieve.
   * @returns An Observable of the budget response.
   */
  getBudget(id: string): Observable<BudgetResponse> {
    return this.http.get<BudgetResponse>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Creates a new budget.
   * @param budget - The budget data transfer object.
   * @returns An Observable of the newly created budget response.
   */
  createBudget(budget: BudgetDto): Observable<BudgetResponse> {
    return this.http.post<BudgetResponse>(this.baseUrl, budget, {
      headers: this.getAuthHeaders(),
    }).pipe(
      // After creating, refresh the list of budgets
      tap(() => this.getMyBudgets())
    );
  }

  /**
   * Updates an existing budget.
   * @param id - The ID of the budget to update.
   * @param budget - The updated budget data.
   * @returns An Observable that completes when the update is successful.
   */
  updateBudget(id: string, budget: BudgetDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, budget, {
      headers: this.getAuthHeaders(),
    }).pipe(
      tap(() => this.getMyBudgets())
    );
  }

  deleteBudget(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      tap(() => this.getMyBudgets())
    );
  }
}
