import React, { useState } from 'react';
import { loginUser } from '../services/api';

export default function Login({ onLoginSuccess, navigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Citizen'); // Citizen, Officer, Admin
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await loginUser(email, password);
      // Double check role matching
      if (user.role.toLowerCase() !== role.toLowerCase()) {
        throw new Error(`Role mismatch. Selected role: ${role}, User role: ${user.role}`);
      }
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickLogin = (quickEmail, quickPassword, quickRole) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    setRole(quickRole);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg mx-auto animate-float">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="font-outfit font-extrabold text-2xl text-slate-100 tracking-tight">
            Welcome back
          </h1>
          <p className="text-slate-400 text-xs">Access CivicPulse Smart City Portal</p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80">
          {['Citizen', 'Officer', 'Admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                setError('');
              }}
              className={`py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                role === r
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-3 rounded-xl text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {role === 'Citizen' && (
          <div className="text-center pt-2 border-t border-slate-900">
            <span className="text-slate-400 text-xs">Don't have an account? </span>
            <button
              onClick={navigateToRegister}
              className="text-blue-400 hover:text-blue-300 font-semibold text-xs transition-colors hover:underline focus:outline-none"
            >
              Sign up
            </button>
          </div>
        )}

        {/* Quick Testing Login Helper */}
        <div className="pt-4 border-t border-slate-900">
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-wider">
            Quick Testing Accounts
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => fillQuickLogin('admin@smartcity.com', 'admin123', 'Admin')}
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 px-2 py-1.5 rounded-lg text-slate-300 transition-all font-medium text-left"
            >
              🔑 <span className="font-semibold text-slate-200">Admin</span> (Global)
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin('roads@smartcity.com', 'officer123', 'Officer')}
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 px-2 py-1.5 rounded-lg text-slate-300 transition-all font-medium text-left"
            >
              🚧 <span className="font-semibold text-slate-200">Roads Officer</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin('water@smartcity.com', 'officer123', 'Officer')}
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 px-2 py-1.5 rounded-lg text-slate-300 transition-all font-medium text-left"
            >
              💧 <span className="font-semibold text-slate-200">Water Officer</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin('electricity@smartcity.com', 'officer123', 'Officer')}
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 px-2 py-1.5 rounded-lg text-slate-300 transition-all font-medium text-left"
            >
              ⚡ <span className="font-semibold text-slate-200">Electric Officer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
