import { user } from "./user.model";

export interface Category {
  id: string;
  name: string;
}

export interface BudgetResponse {
  id: string;
  limitAmount: number;
  month: number;
  year: number;
  createdAt: string; 
  userId: string;
  categoryId: string;
  category: Category;
  user: user; 
}
