import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExpenseDto } from '../models/expense.model';
import { Expense } from '../models/expenseResponse.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private baseUrl =
    // 'https://full-stack-web-applications-2.onrender.com/api/expense';
  'http://localhost:5225/api/expense'; // Adjust port if needed

  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expensesSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getMyExpenses(): void {
    this.http
      .get<Expense[]>(`${this.baseUrl}/me`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe((expenses) => this.expensesSubject.next(expenses));
  }

  getExpense(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createExpense(expense: ExpenseDto): Observable<Expense> {
    console.log('Creating expense:', expense);
    return this.http.post<Expense>(this.baseUrl, expense, {
      headers: this.getAuthHeaders(),
    });
  }

  updateExpense(id: string, expense: ExpenseDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, expense, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
