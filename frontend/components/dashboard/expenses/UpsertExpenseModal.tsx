'use client'
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, DollarSign, X, AlertTriangle, Check, Calendar } from 'lucide-react';
import categoryService, { Category } from '@/service/categoryService';
import expenseService, { Expense, CreateExpenseDto, UpdateExpenseDto } from '@/service/expenseService';

// Modal Components
const UpsertExpenseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expenseData: any) => void;
  expense?: Expense;
  isLoading: boolean;
  title: string;
  categories: Category[];
}> = ({ isOpen, onClose, onSubmit, expense, isLoading, title, categories }) => {
  const [formData, setFormData] = useState<CreateExpenseDto>({
    categoryId: 0,
    amount: 0,
    currency: 'USD',
    note: '',
    spentAt: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (expense) {
      setFormData({
        categoryId: expense.categoryId,
        amount: expense.amount,
        currency: expense.currency,
        note: expense.note || '',
        spentAt: new Date(expense.spentAt).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        categoryId: categories[0]?.id || 0,
        amount: 0,
        currency: 'USD',
        note: '',
        spentAt: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [expense, isOpen, categories]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.currency.trim()) newErrors.currency = 'Currency is required';
    if (!formData.spentAt) newErrors.spentAt = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value={0} disabled>Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency *
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.currency ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
              {errors.currency && <p className="text-red-500 text-xs mt-1">{errors.currency}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                placeholder="Optional note about the expense"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Spent *
              </label>
              <input
                type="date"
                value={formData.spentAt}
                onChange={(e) => handleChange('spentAt', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.spentAt ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.spentAt && <p className="text-red-500 text-xs mt-1">{errors.spentAt}</p>}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : (expense ? 'Update' : 'Add')} Expense
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default UpsertExpenseModal