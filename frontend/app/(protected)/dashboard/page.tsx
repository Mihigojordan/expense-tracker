'use client';
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import * as Icon from 'lucide-react';
import expenseService, { Expense } from '@/service/expenseService';
import categoryService, { Category } from '@/service/categoryService';
import { useAuth } from '@/context/AuthContext';

// Interfaces for component props
interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: keyof typeof Icon;
  color: string;
  isLoading: boolean;
}

interface RecentTransactionsProps {
  transactions: Expense[];
  isLoading: boolean;
}

interface ExpenseChartProps {
  expenses: Expense[];
  isLoading: boolean;
}

interface CategoryBreakdownProps {
  expenses: Expense[];
  isLoading: boolean;
}

// Interfaces for derived data
interface ChartDataPoint {
  date: string;
  amount: number;
}

interface CategoryDataPoint {
  name: string;
  value: number;
}

interface StatsData {
  totalExpenses: number;
  monthlyAverage: number;
  transactionCount: number;
  topCategory: string;
}

// StatsCard component
const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, changeType, icon, color, isLoading }) => {
  const IconComponent = Icon[icon] as React.ComponentType<{ className?: string }>;
  const isPositive = changeType === 'increase';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          )}
          {!isLoading && (
            <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <Icon.TrendingUp size={16} /> : <Icon.TrendingDown size={16} />}
              <span className="ml-1 font-medium">{change}</span>
              <span className="ml-1 text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
        </div>
      </div>
    </div>
  );
};

// RecentTransactions component
const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, isLoading }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <Icon.ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
          ))
        ) : (
          transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon.Receipt className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{transaction.category?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-500">{formatDate(transaction.spentAt)}</p>
              </div>
              <p className="font-semibold text-red-600">-{formatAmount(transaction.amount, transaction.currency)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ExpenseChart component
const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses, isLoading }) => {
 
const chartData = React.useMemo<ChartDataPoint[]>(() => {
  if (!expenses.length) return [];

  const dailyExpenses = new Map<string, number>();

  expenses.forEach(expense => {
    const date = expense.spentAt.split('T')[0]; // raw ISO date
    const amount = Number(expense.amount);
    dailyExpenses.set(date, (dailyExpenses.get(date) || 0) + amount);
  });

  return Array.from(dailyExpenses.entries())
    .map(([date, amount]) => ({
      rawDate: date,
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount
    }))
    .sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime())
    .slice(-7);
}, [expenses]);



  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

      <h3 className="text-lg font-semibold text-gray-900 mb-6">Expense Trend</h3>
      {isLoading ? (
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      ) : (
        <ResponsiveContainer width="100%" height={'90%'}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#ef4444" 
              strokeWidth={2}
              fill="url(#expenseGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// CategoryBreakdown component
const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ expenses, isLoading }) => {
  const COLORS = [
  "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899",
  "#14b8a6", "#f97316", "#a3e635", "#e11d48", "#6366f1", "#0ea5e9",
  "#22c55e", "#d946ef", "#facc15", "#0284c7", "#16a34a", "#c084fc",
  "#f43f5e", "#84cc16", "#f87171", "#60a5fa", "#34d399", "#fb923c",
  "#a78bfa", "#f472b6", "#38bdf8", "#4ade80", "#fbbf24", "#e879f9",
  "#fde047", "#5eead4", "#93c5fd", "#bef264", "#fda4af", "#67e8f9",
  "#86efac", "#fcd34d", "#d8b4fe", "#f9a8d4", "#7dd3fc", "#bbf7d0",
  "#fde68a", "#c7d2fe", "#fbcfe8", "#99f6e4", "#a5b4fc", "#fecdd3",
  "#fef08a", "#e0f2fe"
];


  const categoryData = React.useMemo<CategoryDataPoint[]>(() => {
    if (!expenses.length) return [];
    
    const categoryTotals = expenses.reduce((acc: { [key: string]: number }, expense: Expense) => {
      const categoryName = expense.category?.name || 'Other';
      const amount =Number(expense.amount);
      acc[categoryName] = (acc[categoryName] || 0) + amount;
      return acc;
    }, {});
    
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Number(value)
    }));
  }, [expenses]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h3>
      {isLoading ? (
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  ${category.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const DashboardOverview: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {user} = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [expenseResponse, categoryResponse] = await Promise.all([
          expenseService.getAllExpenses(),
          categoryService.getAllCategories()
        ]);

        if (expenseResponse.success && expenseResponse.data) {
          setExpenses(expenseResponse.data);
        } else {
          setError(expenseResponse.error || 'Failed to fetch expenses');
        }

        if (categoryResponse.success && categoryResponse.data) {
          setCategories(categoryResponse.data);
        } else {
          setError(categoryResponse.error || 'Failed to fetch categories');
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats from real data
  const stats = React.useMemo<StatsData>(() => {
    const defaultStats: StatsData = {
      totalExpenses: 0,
      monthlyAverage: 0,
      transactionCount: 0,
      topCategory: 'N/A'
    };

    if (!expenses.length) {
      return defaultStats;
    }

    const totalExpenses = expenses.reduce((sum, expense) => {
      const amount = Number(expense.amount);
      return sum + amount;
    }, 0);
    const monthlyAverage = totalExpenses / Math.max(1, new Set(expenses.map(e => e.spentAt.slice(0, 7))).size);
    
    // Find top category
    const categoryTotals = expenses.reduce((acc: { [key: string]: number }, expense: Expense) => {
      const categoryName = expense.category?.name || 'Other';
      const amount = Number( expense.amount) ;
      acc[categoryName] = (acc[categoryName] || 0) + amount;
      return acc;
    }, {});
    
    const topCategory = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    return {
      totalExpenses,
      monthlyAverage,
      transactionCount: expenses.length,
      topCategory
    };
  }, [expenses]);

  const statsData: StatsCardProps[] = [
    {
      title: 'Total Expenses',
      value: isLoading || isNaN(stats.totalExpenses) ? 'N/A' : `$${stats.totalExpenses?.toFixed(2)}`,
      change: '+12.5%', // Note: Static change for demo; in real app, compare with previous period
      changeType: 'increase',
      icon: 'CreditCard',
      color: 'bg-red-500',
      isLoading
    },
    {
      title: 'Monthly Average',
      value: isLoading || isNaN(stats.monthlyAverage) ? 'N/A' : `$${stats.monthlyAverage?.toFixed(2)}`,
      change: '+8.2%',
      changeType: 'increase',
      icon: 'TrendingUp',
      color: 'bg-blue-500',
      isLoading
    },
    {
      title: 'Transactions',
      value: stats.transactionCount,
      change: '+5.1%',
      changeType: 'increase',
      icon: 'Receipt',
      color: 'bg-green-500',
      isLoading
    },
    {
      title: 'Top Category',
      value: stats.topCategory,
      change: '+15.3%',
      changeType: 'increase',
      icon: 'Target',
      color: 'bg-purple-500',
      isLoading
    }
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon.AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Good morning, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your finances today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            {...stat}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <ExpenseChart expenses={expenses} isLoading={isLoading} />
        <CategoryBreakdown expenses={expenses} isLoading={isLoading} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={expenses} isLoading={isLoading} />
    </div>
  );
};

export default DashboardOverview;