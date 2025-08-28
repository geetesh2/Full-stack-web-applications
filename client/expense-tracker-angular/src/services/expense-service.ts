import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ExpenseDto } from '../models/expense.model';
import { Expense } from '../models/expenseResponse.model';

export interface RawExpenseResponse {
  id: string;
  userId: string;
  amount: number;
  description?: string;
  date: string; 
  category?: {
    id: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private baseUrl =
    // 'https://full-stack-web-applications-2.onrender.com/api/expense';
    'http://localhost:5555/api/expense'; // Adjust port if needed

  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expensesSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // 🔹 API से data लाकर map करना
  getMyExpenses(): void {
    this.http
      .get<RawExpenseResponse[]>(`${this.baseUrl}/me`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((rawExpenses) =>
          rawExpenses.map<Expense>((raw) => ({
            id: raw.id,
            userId: raw.userId,
            amount: raw.amount,
            description: raw.description || undefined,
            expenseType: raw.category?.name ?? 'Unknown',
            date: new Date(raw.date),
          }))
        )
      )
      .subscribe({
        next: (mappedExpenses) => this.expensesSubject.next(mappedExpenses),
        error: (err) => {
          console.error('❌ Failed to fetch or map expenses:', err);
          this.expensesSubject.next([]);
        },
      });
  }

  getExpense(id: string): Observable<Expense> {
    return this.http.get<RawExpenseResponse>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    })
    .pipe(
      map((raw) => ({
        id: raw.id,
        userId: raw.userId,
        amount: raw.amount,
        description: raw.description || undefined,
        expenseType: raw.category?.name ?? 'Unknown',
        date: new Date(raw.date),
      }))
    );
  }

  createExpense(expense: ExpenseDto): Observable<Expense> {
    console.log('Creating expense:', expense);
    return this.http.post<RawExpenseResponse>(this.baseUrl, expense, {
      headers: this.getAuthHeaders(),
    })
    .pipe(
      map((raw) => ({
        id: raw.id,
        userId: raw.userId,
        amount: raw.amount,
        description: raw.description || undefined,
        expenseType: raw.category?.name ?? 'Unknown',
        date: new Date(raw.date),
      }))
    );
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
