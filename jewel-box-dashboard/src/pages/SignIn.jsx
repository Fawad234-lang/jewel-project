// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { EyeIcon, EyeSlashIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext'; // Import useToast

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { showToast } = useToast(); // Use the toast hook

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('User logged in successfully!', 'success'); // Show success toast
      navigate('/dashboard');
    } catch (err) {
      let errorMessage = 'Failed to sign in. An unexpected error occurred.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many login attempts. Please try again later.';
      }
      showToast(errorMessage, 'error'); // Show error toast
      console.error("Sign-in error:", err.message);
    }
  };

  const inputBaseClasses = "block w-full border rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-200" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-full shadow-md hover:scale-105 transition-transform z-20"
        aria-label="Toggle Dark Mode"
        style={{ backgroundColor: 'var(--bg-button-secondary)', color: 'var(--text-secondary)' }}
      >
        {isDarkMode ? (
          <SunIcon className="h-6 w-6" />
        ) : (
          <MoonIcon className="h-6 w-6" />
        )}
      </button>

      {/* Left Panel: Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-20 relative z-10 transition-colors duration-200"
           style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-semibold mb-2 leading-tight" style={{ color: 'var(--text-primary)' }}>Sign In</h1>
          <p className="mb-10 text-lg" style={{ color: 'var(--text-secondary)' }}>Enter your email and password to sign in.</p>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className={inputBaseClasses}
                placeholder="info@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  borderColor: 'var(--border-light)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`${inputBaseClasses} pr-12`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    borderColor: 'var(--border-light)',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  style={{ color: 'var(--text-placeholder)' }}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}
                />
                <label htmlFor="remember-me" className="ml-2 block cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                  Keep me logged in
                </label>
              </div>
              <a href="#" className="font-medium hover:text-blue-500" style={{ color: 'var(--text-link)' }}>
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel: Visually Appealing Background with SVG Elements */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-8
                  bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900
                  dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
                  transition-colors duration-200">
        {/* Abstract SVG patterns for a luxurious feel */}
        <svg className="absolute inset-0 w-full h-full opacity-30 transform scale-150 animate-pulse-slow" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <circle cx="20" cy="20" r="15" fill="url(#grad1)" className="animate-float-1" />
          <circle cx="80" cy="40" r="20" fill="url(#grad2)" className="animate-float-2" />
          <circle cx="50" cy="80" r="10" fill="url(#grad1)" className="animate-float-3" />
          <rect x="10" y="60" width="15" height="15" fill="url(#grad2)" className="animate-float-4" transform="rotate(45 17.5 67.5)" />
          <polygon points="60,10 70,30 50,30" fill="url(#grad1)" className="animate-float-5" />
        </svg>

        {/* Text Overlay */}
        <div className="relative z-10 text-center text-white p-8">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Your Treasure, Our Expertise
          </h2>
          <p className="text-lg md:text-xl font-light opacity-90">
            Manage your precious inventory with elegance and precision.
          </p>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes float-1 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-2 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-15px, 5px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-3 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(5px, -10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-4 {
          0% { transform: translate(0, 0) rotate(45deg); }
          50% { transform: translate(-10px, -5px) rotate(50deg); }
          100% { transform: translate(0, 0) rotate(45deg); }
        }
        @keyframes float-5 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes pulse-slow {
          0% { opacity: 0.3; transform: scale(1.5); }
          50% { opacity: 0.2; transform: scale(1.6); }
          100% { opacity: 0.3; transform: scale(1.5); }
        }

        .animate-float-1 { animation: float-1 10s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 12s ease-in-out infinite reverse; }
        .animate-float-3 { animation: float-3 8s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 11s ease-in-out infinite; }
        .animate-float-5 { animation: float-5 9s ease-in-out infinite reverse; }
        .animate-pulse-slow { animation: pulse-slow 20s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default SignIn;