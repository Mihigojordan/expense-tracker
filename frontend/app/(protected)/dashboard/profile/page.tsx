'use client'
import { useState, useEffect } from 'react';
import { 

  Mail, 
  Calendar, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Save,
  Edit,
  X,
  Key,
  Clock,
  MapPin,
  UserIcon
} from 'lucide-react';
import { authService } from '@/service/authService';

interface User {
  id: number;
  email: string;
  name?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const UserProfilePage = () => {
  const [user, setUser] = useState<User | any>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        feedback = 'Very weak - Add more characters';
        break;
      case 2:
        feedback = 'Weak - Add uppercase, numbers, and symbols';
        break;
      case 3:
        feedback = 'Fair - Consider adding more complexity';
        break;
      case 4:
        feedback = 'Good - Almost there!';
        break;
      case 5:
        feedback = 'Strong - Great password!';
        break;
      default:
        feedback = 'Enter a password';
        break;
    }

    return { score, feedback };
  };

  useEffect(() => {
    if (passwordForm.newPassword) {
      setPasswordStrength(calculatePasswordStrength(passwordForm.newPassword));
    }
  }, [passwordForm.newPassword]);

  const handlePasswordChange = (field: keyof ChangePasswordForm, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePasswordForm = (): string | null => {
    if (!passwordForm.currentPassword) return 'Current password is required';
    if (!passwordForm.newPassword) return 'New password is required';
    if (passwordForm.newPassword.length < 8) return 'New password must be at least 8 characters';
    if (passwordForm.newPassword === passwordForm.currentPassword) return 'New password must be different from current password';
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) return 'Password confirmation does not match';
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(passwordForm.newPassword)) {
      return 'New password must contain uppercase, lowercase, number, and special character';
    }
    return null;
  };

  const handlePasswordSubmit = async () => {
    const validationError = validatePasswordForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    setPasswordLoading(true);
    setMessage(null);

    try {
      await authService.changePassword(passwordForm);
      setMessage({ type: 'success', text: 'Password changed successfully! You will be logged out from other devices.' });
      
      // Clear form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      
      // Close modal after success
      setTimeout(() => {
        setMessage(null);
        setShowPasswordModal(false);
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setPasswordLoading(false);
    }
  };

  const closeModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setMessage(null);
    setShowPasswords({ current: false, new: false, confirm: false });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPasswordStrengthColor = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-blue-500';
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-20 animate-pulse"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header with animated background */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-700">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-400/20 animate-pulse"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Enhanced Profile Picture */}
                <div className="relative">
                  <div className="h-24 w-24 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-2xl font-bold text-white">
                      {getInitials(user?.name, user?.email)}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-400 border-4 border-white rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-2">
                    {user?.name || 'Welcome'}
                  </h1>
                  <p className="text-blue-100 text-lg font-medium flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    {user?.email}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowPasswordModal(true)}
                className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Key className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 gap-8">
            
            {/* Account Overview Card */}
            <div className="lg:col-span-2">
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>
                      Account Overview
                    </h2>
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                      <Edit className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 p-6 rounded-2xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email Address</h3>
                      <p className="text-gray-600 break-all">{user?.email}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">Verified</span>
                      </div>
                    </div>

                    <div className="group bg-gradient-to-br from-blue-50 to-blue-50 hover:from-blue-100 hover:to-blue-100 p-6 rounded-2xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Account Role</h3>
                      <p className="text-gray-600 capitalize">{user?.role || 'User'}</p>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Active
                        </span>
                      </div>
                    </div>

                    <div className="group bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 p-6 rounded-2xl border border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-green-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Member Since</h3>
                      <p className="text-gray-600">{formatDate(user?.createdAt)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user?.createdAt && Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </p>
                    </div>

                    <div className="group bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 p-6 rounded-2xl border border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-orange-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Last Updated</h3>
                      <p className="text-gray-600">{formatDate(user?.updatedAt)}</p>
                      <p className="text-xs text-gray-500 mt-1">Profile information</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


         
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="relative p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-blue-50 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-xl">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="w-full px-4 py-3.5 border text-black border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3.5 border text-black border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {passwordForm.newPassword && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Password Strength</span>
                      <span className="text-xs font-medium text-gray-500">{passwordStrength.score}/5</span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength.score ? getPasswordStrengthColor(passwordStrength.score) : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">{passwordStrength.feedback}</p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => handlePasswordChange('confirmNewPassword', e.target.value)}
                    className="w-full px-4 py-3.5 border text-black border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {passwordForm.confirmNewPassword && (
                  <div className="mt-2 flex items-center space-x-2">
                    {passwordForm.newPassword === passwordForm.confirmNewPassword ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-600 font-medium">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Message Display */}
              {message && (
                <div className={`p-4 rounded-2xl flex items-center space-x-3 ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3.5 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  disabled={passwordLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white py-3.5 px-6 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {passwordLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfilePage;