import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { authApi } from "../services/api";
import { motion } from "framer-motion";
import {
  UserPlus,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  X,
  ArrowRight,
} from "lucide-react";

const AdminRegister = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Backend validation errors
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));

    setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});
    setGeneralError("");

    try {
      await authApi.getCsrfToken();

      await authApi.register(formData);

      alert("Admin Registered Successfully!");

      setFormData({
        username: "",
        password: "",
      });

      onClose();
    } catch (error) {
      // Laravel validation errors
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setGeneralError(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      {/* Background Overlay with Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#090a0c]/80 backdrop-blur-xl"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-md my-auto bg-[#111317] border border-white/10 rounded-[2.5rem] shadow-2xl z-[10000]"
      >
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white bg-white/5 rounded-full transition-all z-20"
        >
          <X size={20} />
        </button>

        <div className="relative p-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 group">
              <UserPlus
                className="text-emerald-500 group-hover:scale-110 transition-transform"
                size={32}
              />
            </div>

            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white text-center">
              Create <span className="text-emerald-500">Admin</span>
            </h2>

            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              System Management Privileges
            </p>
          </div>

          {/* General Error */}
          {generalError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-2xl px-4 py-3">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 ml-1">
                New Identity
              </label>

              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />

                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose username"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all"
                />
              </div>

              {errors.username && (
                <div className="space-y-1">
                  {errors.username.map((err, index) => (
                    <p
                      key={index}
                      className="text-red-400 text-[11px] font-medium ml-1"
                    >
                      {err}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 ml-1">
                Secure Key
              </label>

              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <div className="space-y-1">
                  {errors.password.map((err, index) => (
                    <p
                      key={index}
                      className="text-red-400 text-[11px] font-medium ml-1"
                    >
                      {err}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-emerald-500 hover:bg-white text-black font-black uppercase text-xs tracking-[0.2em] py-5 rounded-2xl shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all active:scale-95 disabled:opacity-50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Registering..." : "Initialize Admin"}

                {!loading && (
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
            <ShieldCheck size={14} className="text-emerald-500" />

            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Encrypted Admin Enrollment
            </p>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default AdminRegister;