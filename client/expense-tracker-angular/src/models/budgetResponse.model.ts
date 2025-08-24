export interface Category {
  id: string;
  name: string;
}

/**
 * Represents the detailed budget object received from the backend.
 */
export interface BudgetResponse {
  id: string;
  limitAmount: number;
  month: number;
  year: number;
  createdAt: string; // ISO date string
  userId: string;
  categoryId: string;
  category: Category;
  user: any; // The 'user' property is null in the example, so 'any' is used. Adjust if you have a User model.
}
