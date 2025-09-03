// services/categoryService.ts
import api from '@/api'; // Adjust path to your api file

// Types/Interfaces
export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export interface ExistsResponse {
  exists: boolean;
}

class CategoryService {
  // Get all categories
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await api.get<Category[]>('/categories');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to fetch categories'
      };
    }
  }

  // Get category by ID
  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    try {
      const response = await api.get<Category>(`/categories/${id}`);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || `Failed to fetch category with ID ${id}`
      };
    }
  }

  // Create new category
  async createCategory(categoryData: CreateCategoryDto): Promise<ApiResponse<Category>> {
    try {
      const response = await api.post<Category>('/categories', categoryData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to create category'
      };
    }
  }

  // Update category
  async updateCategory(id: number, categoryData: UpdateCategoryDto): Promise<ApiResponse<Category>> {
    try {
      const response = await api.patch<Category>(`/categories/${id}`, categoryData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || `Failed to update category with ID ${id}`
      };
    }
  }

  // Delete category
  async deleteCategory(id: number): Promise<ApiResponse<{ message: string }>> {
    try {
      await api.delete(`/categories/${id}`);
      return {
        success: true,
        data: { message: 'Category deleted successfully' },
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || `Failed to delete category with ID ${id}`
      };
    }
  }

  // Check if category exists by ID
  async checkCategoryExists(id: number): Promise<ApiResponse<ExistsResponse>> {
    try {
      const response = await api.get<ExistsResponse>(`/categories/${id}/exists`);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: { exists: false },
        error: error.response?.data?.message || 'Failed to check category existence'
      };
    }
  }

  // Check if category exists by name
  async checkCategoryExistsByName(name: string): Promise<ApiResponse<ExistsResponse>> {
    try {
      const response = await api.get<ExistsResponse>(`/categories/name/${encodeURIComponent(name)}/exists`);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: { exists: false },
        error: error.response?.data?.message || 'Failed to check category name existence'
      };
    }
  }
}

// Create and export instance
const categoryService = new CategoryService();
export default categoryService;
