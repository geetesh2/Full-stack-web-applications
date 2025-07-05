export interface Expense {
  id: string;
  userId: string;
  expenseType?: string;
  amount: number;
  description?: string;
  date: Date;
}
