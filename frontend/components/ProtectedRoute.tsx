'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For App Router
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute component for Next.js
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex bg-white text-black items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Show fallback or redirect
  if (!isAuthenticated) {
    return fallback || (
      <div className="flex bg-white text-black items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Higher-order component for protecting pages
 * Usage: export default withAuth(YourPageComponent);
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectTo: string = '/login'
) {
  const AuthenticatedComponent = (props: P) => {
    return (
      <ProtectedRoute redirectTo={redirectTo}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return AuthenticatedComponent;
}

/**
 * Component that only shows content to authenticated users
 * Useful for conditional rendering within pages
 */
export const AuthOnly: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ children, fallback = null }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Component that only shows content to guests (non-authenticated users)
 * Useful for login/register pages
 */
export const GuestOnly: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}> = ({ children, fallback, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};