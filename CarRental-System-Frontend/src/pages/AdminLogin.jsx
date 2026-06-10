import React, { useState } from 'react';
import { authApi } from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Eye, EyeOff, X, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

const AdminLogin = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); // New state for backend validation

  const location = useLocation();
  const navigate = useNavigate();

  const isActuallyOpen = isOpen || location.pathname === '/admin/login';
  if (!isActuallyOpen) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Reset errors on new attempt

    try {
      await authApi.getCsrfToken();
      const response = await authApi.login(formData);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/admin/dashboard';
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Capture Laravel validation errors
        setErrors(error.response.data.errors);
      } else {
        // Generic error handling
        setErrors({ general: [error.response?.data?.message || "Invalid credentials. Access Denied."] });
      }
      console.error("Login Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Helper component for displaying error messages with animation
  const ErrorMessage = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center gap-1.5 mt-2 text-rose-500"
    >
      <AlertCircle size={12} />
      <span className="text-[11px] font-semibold tracking-wide uppercase">{message}</span>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#090a0c]/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md overflow-hidden bg-[#111317] border border-white/10 rounded-[2.5rem] shadow-2xl"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-3xl animate-pulse"></div>
        
        <button 
          onClick={handleClose} 
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white bg-white/5 rounded-full transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="relative p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6">
              <ShieldCheck className="text-black" size={32} />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white text-center">
              Admin <span className="text-emerald-500">Access</span>
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Secure Management Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error (e.g., 401 Unauthorized) */}
            <AnimatePresence>
              {errors.general && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold text-center uppercase tracking-widest"
                >
                  {errors.general[0]}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 ml-1">Identity</label>
              <div className="relative group">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.username ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-emerald-500'}`} size={18} />
                <input
                  type="text"
                  className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none transition-all ${errors.username ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/10 focus:border-emerald-500 focus:bg-emerald-500/5'}`}
                  placeholder="Username"
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <AnimatePresence>
                {errors.username && <ErrorMessage message={errors.username[0]} />}
              </AnimatePresence>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 ml-1">Credentials</label>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-emerald-500'}`} size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none transition-all ${errors.password ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/10 focus:border-emerald-500 focus:bg-emerald-500/5'}`}
                  placeholder="••••••••"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && <ErrorMessage message={errors.password[0]} />}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-emerald-500 hover:bg-white text-black font-black uppercase text-xs tracking-[0.2em] py-5 rounded-2xl shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all active:scale-95 disabled:opacity-50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Verifying..." : "Authorize Entry"}
                {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            Unauthorized access is strictly prohibited
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;