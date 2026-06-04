import React, { useState } from 'react';
import { registerUser } from '../services/api';

export default function Register({ onRegisterSuccess, navigateToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await registerUser({
        name,
        email,
        password_hash: password, // compatible with our seed database schema
        phone: phone || null,
        role: 'Citizen',
      });
      setSuccess(true);
      setTimeout(() => {
        navigateToLogin();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg mx-auto animate-float">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="font-outfit font-extrabold text-2xl text-slate-100 tracking-tight">
            Create an Account
          </h1>
          <p className="text-slate-400 text-xs">Join CivicPulse to report and track issues</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-3 rounded-xl text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-3 rounded-xl text-xs font-medium">
            🎉 Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={name}
              disabled={success || isLoading}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={email}
              disabled={success || isLoading}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              disabled={success || isLoading}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              disabled={success || isLoading}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-900">
          <span className="text-slate-400 text-xs">Already have an account? </span>
          <button
            onClick={navigateToLogin}
            className="text-blue-400 hover:text-blue-300 font-semibold text-xs transition-colors hover:underline focus:outline-none"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
