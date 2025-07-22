import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TypingEffect } from '../ui/typing-effect';
import { Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useThemeStore } from '../../lib/theme-store';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useThemeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: userId,
          password: password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setError('Check your email for the confirmation link.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: userId,
          password: password,
        });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-effect py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          <div className="mb-6 text-center">
            <TypingEffect
              text={mode === 'login' ? 'Welcome Back!' : 'Create Account'}
              className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
            />
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {mode === 'login'
                ? 'Sign in to access your files'
                : 'Register to start sharing files securely'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="userId" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
                <input
                  id="userId"
                  name="userId"
                  type="email"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 glass-effect rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 glass-effect rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your password"
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 backdrop-blur-sm border border-red-500/20 p-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </motion.button>
            </div>

            <div className="text-center mt-4">
              <Link
                to={mode === 'login' ? '/register' : '/'}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                {mode === 'login'
                  ? "Don't have an account? Register"
                  : 'Already have an account? Sign in'}
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}