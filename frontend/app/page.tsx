"use client";
import { useEffect, useState } from "react"
import Head from 'next/head'
import Link from 'next/link'
import api from "@/api";

// Simple icons as SVG components
const DollarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
)

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const BellIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12m-3.12-3.12a7 7 0 1110.61 10.61M10.07 2.82L2.82 10.07a7 7 0 0010.61 10.61m0 0l3.12 3.12M8 21l4-7 4 7M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
)

const MobileIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
  </svg>
)

const SyncIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  console.log('api',process.env.NEXT_PUBLIC_BACKEND_API_URL);
  

  return (
    <>
      <Head>
        <title>ExpenseFlow - Smart Expense Tracking Made Simple</title>
        <meta name="description" content="Track your expenses effortlessly with ExpenseFlow. Smart categorization, beautiful insights, and complete financial control in one powerful app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav className={`fixed top-0 w-full py-2 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-blue-100/50' : 'bg-white/90 backdrop-blur-sm'
        }`}>
          <div className="w-11/12 mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                  <DollarIcon />
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">ExpenseFlow</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  How it Works
                </Link>
                <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Pricing
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Sign In
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-28 pb-16 px-6 relative overflow-hidden">
          {/* Background gradient orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          
          <div className="w-11/12 mx-auto relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
         
                Take Control of Your
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Financial Future</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Smart expense tracking with AI-powered insights. Understand your spending, 
                set better budgets, and achieve your financial goals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Start Free Trial
                </Link>
                <Link href="#demo" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:border-blue-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                  Watch Demo
                </Link>
              </div>

              {/* Hero Dashboard Preview */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden relative">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 pointer-events-none"></div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 relative z-10">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="p-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">$2,340</div>
                        <div className="text-gray-600">Income</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">$1,890</div>
                        <div className="text-gray-600">Expenses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">$450</div>
                        <div className="text-gray-600">Saved</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-gray-600">
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100/50">
                        <span className="font-medium">Food & Dining</span>
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">$320</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg border border-gray-100/50">
                        <span className="font-medium">Transportation</span>
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">$180</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border border-gray-100/50">
                        <span className="font-medium">Entertainment</span>
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">$95</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 bg-gradient-to-br from-gray-50 via-blue-50/50 to-indigo-50 relative">
          {/* Background gradient orbs */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
          
          <div className="w-11/12 mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Simple, Powerful Features
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to manage your finances effectively
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg">
                    <DollarIcon />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Categorization</h3>
                  <p className="text-gray-600">
                    Automatically categorize your expenses with AI that learns your spending patterns.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg">
                    <ChartIcon />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Visual Insights</h3>
                  <p className="text-gray-600">
                    Clear charts and reports that help you understand your spending habits.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg">
                    <ShieldIcon />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Bank-Level Security</h3>
                  <p className="text-gray-600">
                    Your data is protected with enterprise-grade encryption and security.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-rose-50/50 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg">
                    <BellIcon />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Alerts</h3>
                  <p className="text-gray-600">
                    Get notified about spending limits, bills, and budget goals.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-orange-50/50 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-orange-600 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg">
                    <MobileIcon />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Ready</h3>
                  <p className="text-gray-600">
                    Track expenses anywhere with our mobile-optimized interface.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/50 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg">
                    <SyncIcon />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Sync</h3>
                  <p className="text-gray-600">
                    Your data syncs instantly across all your devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-6 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          
          <div className="w-11/12 mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Get Started in 3 Simple Steps
              </h2>
              <p className="text-xl text-gray-600">
                From setup to insights in minutes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold shadow-xl">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect Accounts</h3>
                <p className="text-gray-600">
                  Securely link your bank accounts and credit cards with read-only access.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold shadow-xl">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Auto-Categorize</h3>
                <p className="text-gray-600">
                  Our AI automatically sorts and categorizes all your transactions.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold shadow-xl">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Insights</h3>
                <p className="text-gray-600">
                  Receive personalized recommendations to optimize your spending.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 px-6 bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/30">
          <div className="w-11/12 mx-auto text-center">
            <p className="text-gray-500 mb-8 font-medium">Trusted by thousands of users worldwide</p>
            <div className="flex justify-center items-center space-x-12 opacity-50">
              <div className="text-xl font-semibold bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">TechCrunch</div>
              <div className="text-xl font-semibold bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">Forbes</div>
              <div className="text-xl font-semibold bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">WSJ</div>
              <div className="text-xl font-semibold bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">Bloomberg</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50"></div>
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Take Control?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands who've transformed their financial habits. 
              Start your free trial today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Start Free Trial
              </Link>
              <Link href="/login" className="border-2 border-white/80 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-white hover:text-blue-600 transition-all duration-300 backdrop-blur-sm">
                Sign In
              </Link>
            </div>
            
            <p className="text-blue-200 text-sm">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="w-11/12 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                  <DollarIcon />
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">ExpenseFlow</span>
              </div>
              
              <div className="flex items-center space-x-6 text-gray-400">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/support" className="hover:text-white transition-colors">Support</Link>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>&copy; 2025 ExpenseFlow. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}