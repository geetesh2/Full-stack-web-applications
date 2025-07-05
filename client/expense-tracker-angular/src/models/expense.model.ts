export interface ExpenseDto {
  expenseType: string;
  amount: number;
  description?: string;
  date: Date;
}
