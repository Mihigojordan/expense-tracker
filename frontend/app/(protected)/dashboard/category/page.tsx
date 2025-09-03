
'use client'
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Tag, X, AlertTriangle, Check } from 'lucide-react';
import categoryService, { Category, CreateCategoryDto, UpdateCategoryDto } from '@/service/categoryService';
import DeleteCategoryModal from '@/components/dashboard/category/DeleteCategoryModal'
import UpsertCategoryModal from '@/components/dashboard/category/UpsertCategoryModal'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const router = useRouter()


  const {user,isAuthenticated,isLoading:authLoading} = useAuth()
  useEffect(()=>{

    if(user && user.role !== 'ADMIN' && isAuthenticated && !authLoading){
      router.replace('/dashboard')
    }

  },[authLoading,isAuthenticated,user])

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoryService.getAllCategories();
      if (response.success && response.data) {
        setCategories(response.data);
        setFilteredCategories(response.data);
        if (response.data.length === 0) {
          showNotification('No categories found', 'error');
        }
      } else {
        throw new Error(response.error || 'Failed to fetch categories');
      }
    } catch (error: any) {
      showNotification(`Failed to fetch categories: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
    setCurrentPage(1);
  }, [searchTerm, categories]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCategories.slice(startIndex, endIndex);

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

  const handleAddCategory = async (categoryData: CreateCategoryDto) => {
    setIsLoading(true);
    try {
      const response = await categoryService.createCategory(categoryData);
      if (response.success && response.data) {
        await fetchCategories();
        setIsAddModalOpen(false);
        showNotification('Category added successfully!');
      } else {
        throw new Error(response.error || 'Failed to add category');
      }
    } catch (error: any) {
      showNotification(`Failed to add category: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async (categoryData: UpdateCategoryDto) => {
    setIsLoading(true);
    try {
      if (!selectedCategory) {
        throw new Error('No category selected for editing');
      }
      const response = await categoryService.updateCategory(selectedCategory.id, categoryData);
      if (response.success && response.data) {
        await fetchCategories();
        setIsEditModalOpen(false);
        setSelectedCategory(null);
        showNotification('Category updated successfully!');
      } else {
        throw new Error(response.error || 'Failed to update category');
      }
    } catch (error: any) {
      showNotification(`Failed to update category: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    setIsLoading(true);
    try {
      if (!selectedCategory) {
        throw new Error('No category selected for deletion');
      }
      const response = await categoryService.deleteCategory(selectedCategory.id);
      if (response.success) {
        setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
        setFilteredCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
        showNotification('Category deleted successfully!');
      } else {
        throw new Error(response.error || 'Failed to delete category');
      }
    } catch (error: any) {
      showNotification(`Failed to delete category: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const PaginationComponent: React.FC = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length} entries
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
        {currentItems.map((category, index) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {category.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <div className="text-xs text-gray-500">
                      ID: {category.id}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(category)}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-lg transition-colors"
                    title="Edit category"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(category)}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg transition-colors"
                    title="Delete category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Created {formatDate(category.createdAt)}</span>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((category, index) => (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {startIndex + index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {category.name[0]?.toUpperCase()}
                    </div>
                    <div className="font-medium text-gray-900">{category.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{formatDate(category.createdAt)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(category)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
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
              <Tag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          </div>
          <p className="text-gray-600">Manage your expense categories</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading categories...</p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first category.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus size={20} />
                Add Category
              </button>
            )}
          </div>
        ) : (
          <>
            <CardView />
            <TableView />
          </>
        )}

        <UpsertCategoryModal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={closeAllModals}
          onSubmit={isEditModalOpen ? handleEditCategory : handleAddCategory}
          category={selectedCategory!}
          isLoading={isLoading}
          title={isEditModalOpen ? 'Edit Category' : 'Add New Category'}
        />

        <DeleteCategoryModal
          isOpen={isDeleteModalOpen}
          onClose={closeAllModals}
          onConfirm={handleDeleteCategory}
          category={selectedCategory!}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CategoryManagement;