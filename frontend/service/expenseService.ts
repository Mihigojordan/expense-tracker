// services/expenseService.ts
import api from '@/api'; // Adjust path to your api file

// Types/Interfaces
export interface Expense {
  id: number;
  userId: string;
  categoryId: number;
  amount: number;
  currency: string;
  note?: string;
  spentAt: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
  };
}

export interface CreateExpenseDto {
  categoryId: number;
  amount: number;
  currency: string;
  note?: string;
  spentAt: string;
}

export interface UpdateExpenseDto {
  categoryId?: number;
  amount?: number;
  currency?: string;
  note?: string;
  spentAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

class ExpenseService {
  // Get all expenses for logged-in user
  async getAllExpenses(): Promise<ApiResponse<Expense[]>> {
    try {
      const response = await api.get<Expense[]>('/expenses');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to fetch expenses'
      };
    }
  }
  async getAllExpensesAdmin(): Promise<ApiResponse<Expense[]>> {
    try {
      const response = await api.get<Expense[]>('/expenses/all');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to fetch expenses'
      };
    }
  }

  // Get single expense by ID
  async getExpenseById(id: number): Promise<ApiResponse<Expense>> {
    try {
      const response = await api.get<Expense>(`/expenses/${id}`);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || `Failed to fetch expense with ID ${id}`
      };
    }
  }

  // Create new expense
  async createExpense(expenseData: CreateExpenseDto): Promise<ApiResponse<Expense>> {
    try {
      const response = await api.post<Expense>('/expenses', expenseData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to create expense'
      };
    }
  }

  // Update existing expense
  async updateExpense(id: number, expenseData: UpdateExpenseDto): Promise<ApiResponse<Expense>> {
    try {
      const response = await api.put<Expense>(`/expenses/${id}`, expenseData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || `Failed to update expense with ID ${id}`
      };
    }
  }

  // Delete expense
  async deleteExpense(id: number): Promise<ApiResponse<{ message: string }>> {
    try {
      await api.delete(`/expenses/${id}`);
      return {
        success: true,
        data: { message: 'Expense deleted successfully' },
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || `Failed to delete expense with ID ${id}`
      };
    }
  }
}

// Create and export instance
const expenseService = new ExpenseService();
export default expenseService;
