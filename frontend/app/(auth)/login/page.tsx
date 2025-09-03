'use client';
import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Adjust the import path based on your file structure
import { LoginDto } from '@/service/authService';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const router = useRouter();

  
    const { login, isLoading,isAuthenticated } = useAuth();
  
    useEffect(()=>{
  
      if(isAuthenticated&&!isLoading){
         router.replace('/dashboard')
      }
  
    },[isAuthenticated,isLoading])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    const loginData: LoginDto = { email, password };

    try {
      await login(loginData);
      router.replace('/dashboard')
      // On successful login, you can redirect or update UI
      // For example, redirect to dashboard:
      // window.location.href = '/dashboard';
      console.log('Login successful', { email, rememberMe });
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Login Form */}
      <div className=" w-full md:w-2/5 bg-white flex items-center justify-center p-8 shadow-lg">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">ExpenseFlow</h1>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome back</h2>
            <p className="text-gray-600 text-sm">
              Track your expenses and take control of your financial future with advanced analytics and insights.
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 text-blue-600"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={!email || !password || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            New to ExpenseFlow?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Background Image */}
      <div
        className=" hidden md:block md:w-3/5 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80')",
        }}
      >
        <div className="w-full h-full bg-black/20"></div>
      </div>
    </div>
  );
}