import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Loader } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();
  const { signup, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [clientError, setClientError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setClientError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError('');

    if (formData.password !== formData.confirmPassword) {
      setClientError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setClientError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // ✅ Auto-generate username to avoid backend duplicate key errors
      const username =
        formData.name.replace(/\s+/g, '').toLowerCase() +
        '_' +
        Math.floor(Math.random() * 10000);

      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        username, // ✅ send unique username
      });
      navigate('/home');
    } catch (error) {
      setClientError(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md backdrop-blur-xl bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-[0_0_40px_-10px_rgba(139,92,246,0.4)] transition-all duration-300">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
            Create Your Account 🚀
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Join <span className="text-purple-400 font-semibold">InfinityChat</span> and explore AI-powered conversations.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {(clientError || error) && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm text-center">
              {clientError || error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 bg-slate-800/70 border border-slate-700 
                           rounded-lg text-white placeholder-gray-500 focus:outline-none 
                           focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 bg-slate-800/70 border border-slate-700 
                           rounded-lg text-white placeholder-gray-500 focus:outline-none 
                           focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-slate-800/70 border border-slate-700 
                           rounded-lg text-white placeholder-gray-500 focus:outline-none 
                           focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-slate-800/70 border border-slate-700 
                           rounded-lg text-white placeholder-gray-500 focus:outline-none 
                           focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-linear-to-r from-purple-600 to-cyan-600 
                      hover:from-purple-500 hover:to-cyan-500 disabled:opacity-60
                      text-white font-semibold rounded-lg transition-all flex items-center 
                      justify-center gap-2 shadow-[0_0_10px_rgba(139,92,246,0.4)] hover:shadow-[0_0_15px_rgba(139,92,246,0.6)]"
          >
            {loading && <Loader size={18} className="animate-spin" />}
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 mt-8 text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-medium transition-all"
          >
            Log in
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © {new Date().getFullYear()} InfinityChat · Created by{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-cyan-300 font-semibold">
            Manish Kumar Yadav
          </span>
        </p>
      </div>
    </div>
  );
}
