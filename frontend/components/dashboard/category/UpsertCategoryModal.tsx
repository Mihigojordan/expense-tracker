'use client'
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Tag, X, AlertTriangle, Check } from 'lucide-react';
import categoryService, { Category, CreateCategoryDto, UpdateCategoryDto } from '@/service/categoryService';

// Modal Components
const UpsertCategoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryData: any) => any;
  category?: Category;
  isLoading: boolean;
  title: string;
}> = ({ isOpen, onClose, onSubmit, category, isLoading, title }) => {
  const [formData, setFormData] = useState<CreateCategoryDto>({ name: '' });
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name });
    } else {
      setFormData({ name: '' });
    }
    setErrors({});
  }, [category, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const existsResponse = await categoryService.checkCategoryExistsByName(formData.name);
        if (existsResponse.data?.exists && !category) {
          setErrors({ name: 'Category name already exists' });
          return;
        }
        onSubmit(formData);
      } catch (error) {
        setErrors({ name: 'Failed to validate category name' });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value });
    if (errors.name) setErrors({ name: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Office Supplies"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
                {isLoading ? 'Saving...' : (category ? 'Update' : 'Add')} Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpsertCategoryModal