'use client'

import React, { useState, ReactNode } from 'react';


import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';

// Define props interface for Dashboard
interface DashboardProps {
  children: ReactNode;
}

// Main Dashboard Component
const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />
        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;