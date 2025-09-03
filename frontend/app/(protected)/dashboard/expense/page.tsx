'use client'
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, DollarSign, X, AlertTriangle, Check, Calendar } from 'lucide-react';
import categoryService, { Category } from '@/service/categoryService';
import expenseService, { Expense, CreateExpenseDto, UpdateExpenseDto } from '@/service/expenseService';
import UpsertExpenseModal from '@/components/dashboard/expenses/UpsertExpenseModal';
import DeleteExpenseModal from '@/components/dashboard/expenses/DeleteExpenseModal';
import { useAuth } from '@/context/AuthContext';



const ExpenseManagement: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const {user} = useAuth()

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await expenseService.getAllExpenses();
      if (response.success && response.data) {
        setExpenses(response.data);
        setFilteredExpenses(response.data);
        if (response.data.length === 0) {
          showNotification('No expenses found', 'error');
        }
      } else {
        throw new Error(response.error || 'Failed to fetch expenses');
      }
    } catch (error: any) {
      showNotification(`Failed to fetch expenses: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch categories');
      }
    } catch (error: any) {
      showNotification(`Failed to fetch categories: ${error.message}`, 'error');
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = expenses.filter(expense =>
      (expense.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toString().includes(searchTerm))
    );
    setFilteredExpenses(filtered);
    setCurrentPage(1);
  }, [searchTerm, expenses]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredExpenses.slice(startIndex, endIndex);

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddExpense = async (expenseData: CreateExpenseDto) => {
    setIsLoading(true);
    try {
      const categoryExists = await categoryService.checkCategoryExists(expenseData.categoryId);
      if (!categoryExists.success || !categoryExists.data?.exists) {
        throw new Error('Selected category does not exist');
      }
      const response = await expenseService.createExpense(expenseData);
      if (response.success && response.data) {
        await fetchExpenses();
        setIsAddModalOpen(false);
        showNotification('Expense added successfully!');
      } else {
        throw new Error(response.error || 'Failed to add expense');
      }
    } catch (error: any) {
      showNotification(`Failed to add expense: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditExpense = async (expenseData: UpdateExpenseDto) => {
    setIsLoading(true);
    try {
      if (!selectedExpense) {
        throw new Error('No expense selected for editing');
      }
      if (expenseData.categoryId) {
        const categoryExists = await categoryService.checkCategoryExists(expenseData.categoryId);
        if (!categoryExists.success || !categoryExists.data?.exists) {
          throw new Error('Selected category does not exist');
        }
      }
      const response = await expenseService.updateExpense(selectedExpense.id, expenseData);
      if (response.success && response.data) {
        await fetchExpenses();
        setIsEditModalOpen(false);
        setSelectedExpense(null);
        showNotification('Expense updated successfully!');
      } else {
        throw new Error(response.error || 'Failed to update expense');
      }
    } catch (error: any) {
      showNotification(`Failed to update expense: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async () => {
    setIsLoading(true);
    try {
      if (!selectedExpense) {
        throw new Error('No expense selected for deletion');
      }
      const response = await expenseService.deleteExpense(selectedExpense.id);
      if (response.success) {
        setExpenses(prev => prev.filter(exp => exp.id !== selectedExpense.id));
        setFilteredExpenses(prev => prev.filter(exp => exp.id !== selectedExpense.id));
        setIsDeleteModalOpen(false);
        setSelectedExpense(null);
        showNotification('Expense deleted successfully!');
      } else {
        throw new Error(response.error || 'Failed to delete expense');
      }
    } catch (error: any) {
      showNotification(`Failed to delete expense: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedExpense(null);
  };

  const PaginationComponent: React.FC = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredExpenses.length)} of {filteredExpenses.length} entries
        </p>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-md transition-colors ${
              currentPage === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Previous
          </button>
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-md transition-colors ${
              currentPage === totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  const CardView: React.FC = () => (
    <div className="md:hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {currentItems.map((expense, index) => (
          <div key={expense.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {expense.category?.name[0]?.toUpperCase() || '$'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{expense.category?.name || 'Unknown Category'}</h3>
                    <div className="text-sm font-medium text-gray-900">
                      {formatAmount(expense.amount, expense.currency)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(expense)}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-lg transition-colors"
                    title="Edit expense"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(expense)}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Note:</span> {expense.note || 'No note'}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Spent:</span> {formatDate(expense.spentAt)}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={12} />
                  <span>Created {formatDate(expense.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <PaginationComponent />
      </div>
    </div>
  );

  const TableView: React.FC = () => (
    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((expense, index) => (
              <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {startIndex + index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {expense.category?.name[0]?.toUpperCase() || '$'}
                    </div>
                    <div className="font-medium text-gray-900">{expense.category?.name || 'Unknown Category'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{formatAmount(expense.amount, expense.currency)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 truncate max-w-48">{expense.note || 'No note'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{formatDate(expense.spentAt)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{formatDate(expense.createdAt)}</div>
                </td>
{
  user?.id == expense.userId ?(
                    <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(expense)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(expense)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
  ) :
  <td className="px-6 py-4 whitespace-nowrap">
    <p className='text-gray-400'>no actions</p>
  </td>
}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationComponent />
    </div>
  );

  return (
    <div className="bg-gray-50 p-4 h-[90vh] sm:p-6 lg:p-8">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        } animate-in slide-in-from-top-2 duration-300`}>
          {notification.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
          {notification.message}
        </div>
      )}

      <div className="h-full overflow-y-auto mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          </div>
          <p className="text-gray-600">Manage your expenses</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search expenses by category, note, or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={isLoading || categories.length === 0}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus size={20} />
              Add Expense
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading expenses...</p>
            </div>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : categories.length === 0 ? 'Please add a category first.' : 'Get started by adding your first expense.'}
            </p>
            {!searchTerm && categories.length > 0 && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus size={20} />
                Add Expense
              </button>
            )}
          </div>
        ) : (
          <>
            <CardView />
            <TableView />
          </>
        )}

        <UpsertExpenseModal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={closeAllModals}
          onSubmit={isEditModalOpen ? handleEditExpense : handleAddExpense}
          expense={selectedExpense!}
          isLoading={isLoading}
          title={isEditModalOpen ? 'Edit Expense' : 'Add New Expense'}
          categories={categories}
        />

        <DeleteExpenseModal

          isOpen={isDeleteModalOpen}
          onClose={closeAllModals}
          onConfirm={handleDeleteExpense}
          expense={selectedExpense!}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ExpenseManagement;