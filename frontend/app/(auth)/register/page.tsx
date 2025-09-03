'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, DollarSign, User, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Adjust the import path based on your file structure
import { RegisterDto } from '@/service/authService';

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, isLoading } = useAuth();
    const router = useRouter();

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        setError(null); // Clear error on input change
    };

    const isPasswordValid = () => {
        return (
            formData.password.length >= 8 &&
            /[A-Z]/.test(formData.password) &&
            /[0-9]/.test(formData.password)
        );
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!agreeToTerms) {
            setError('You must agree to the terms and conditions.');
            return;
        }

        if (!isPasswordValid()) {
            setError('Password does not meet all requirements.');
            return;
        }

        const registerData: RegisterDto = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
        };

        try {
            await register(registerData);
            // Redirect to dashboard or login page after successful registration
            router.push('/login'); // Adjust the redirect path as needed
            console.log('Registration successful', { ...formData, agreeToTerms });
        } catch (err) {
            setError('Registration failed. Please check your details and try again.');
            console.error('Registration error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Panel - Register Form */}
            <div className="w-full md:w-2/5 bg-white flex items-center justify-center p-8 shadow-lg">
                <div className="w-full max-w-md">
                    {/* Logo and Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">ExpenseFlow</h1>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Create your account</h2>
                        <p className="text-gray-600 text-sm">
                            Join thousands of users who are already managing their finances smarter with ExpenseFlow.
                        </p>
                    </div>

                    {/* Register Form */}
                    <form className="space-y-4" onSubmit={handleRegister}>
                        {/* Error Message */}
                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}

                        {/* Name Input */}
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Full name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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

                        {/* Password Requirements */}
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>Password must contain:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                                    At least 8 characters
                                </li>
                                <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                                    One uppercase letter
                                </li>
                                <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                                    One number
                                </li>
                            </ul>
                        </div>

                        {/* Terms and Conditions Checkbox */}
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className="w-4 h-4 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 text-blue-600"
                            />
                            <label className="cursor-pointer">
                                I agree to the{' '}
                                <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                                    Terms and Conditions
                                </Link>
                            </label>
                        </div>

                        {/* Create Account Button */}
                        <button
                            type="submit"
                            disabled={!formData.name || !formData.email || !formData.password || !agreeToTerms || isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="text-center text-gray-600 text-sm mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Panel - Background Image */}
            <div
                className="hidden md:block md:w-3/5 bg-cover bg-center bg-no-repeat"
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