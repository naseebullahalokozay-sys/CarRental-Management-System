import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  User, 
  Phone, 
  Upload, 
  FileText, 
  CheckCircle2, 
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from "react-toastify";
import { customerApi, bookingApi } from '../services/api';

const BookingModal = ({ car, onClose }) => {
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    tazkira_photo: null,
    photo: null,
    driving_license_photo: null,
    booking_date: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({}); // Track validation errors

  const handleFileChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.files[0] });
    // Clear error for this field when a file is selected
    if (errors[e.target.name]) {
      const newErrors = { ...errors };
      delete newErrors[e.target.name];
      setErrors(newErrors);
    }
  };

  const handleInputChange = (field, value) => {
    setCustomerData({ ...customerData, [field]: value });
    // Clear error for this field when user types
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); // Reset errors

    const formData = new FormData();
    Object.keys(customerData).forEach(key => {
      if (customerData[key]) {
        formData.append(key, customerData[key]);
      }
    });

    try {
      const res = await customerApi.create(formData);
      const customer = res.data.data;

      await bookingApi.create({
        customer_id: customer.id,
        car_id: car.id,
        booking_date: customerData.booking_date,
        status: 'pending',
      });

      alert('Booking request sent successfully!');
      onClose();
    } catch (err) {
      
      
      if (err.response && err.response.status === 422) {
        // Map Laravel validation errors to state
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: ['Something went wrong. Please try again.'] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for field error messages
  const ErrorMsg = ({ error }) => (
    <AnimatePresence>
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 mt-1 text-rose-500"
        >
          <AlertCircle size={10} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">{error[0]}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#111317] w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
      >
        {/* Header */}
        <div className="relative p-8 border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-white/5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500 rounded-2xl text-black">
              <Calendar size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                Reserve <span className="text-emerald-500">{car.model}</span>
              </h2>
              <p className="text-slate-400 text-sm font-medium">Complete the form to secure your booking.</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
          
          {/* General Error Message */}
          <AnimatePresence>
            {errors.general && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold text-center uppercase tracking-widest"
              >
                {errors.general[0]}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-1">Full Name</label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-rose-500' : 'text-slate-500'}`} size={18} />
                <input 
                  type="text"
                  placeholder="Enter Name"
                  className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none transition-all ${errors.name ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/10 focus:border-emerald-500'}`}
                  onChange={e => handleInputChange('name', e.target.value)}
                />
              </div>
              <ErrorMsg error={errors.name} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-rose-500' : 'text-slate-500'}`} size={18} />
                <input 
                  type="text"
                  placeholder="+93 7xx xxx xxx"
                  className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none transition-all ${errors.phone ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/10 focus:border-emerald-500'}`}
                  onChange={e => handleInputChange('phone', e.target.value)}
                />
              </div>
              <ErrorMsg error={errors.phone} />
            </div>
          </div>

          {/* Section 2: Date Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-1">Pickup Date</label>
            <div className="relative">
              <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.booking_date ? 'text-rose-500' : 'text-slate-500'}`} size={18} />
              <input 
                type="date"
                className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none transition-all appearance-none ${errors.booking_date ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/10 focus:border-emerald-500'}`}
                onChange={e => handleInputChange('booking_date', e.target.value)}
              />
            </div>
            <ErrorMsg error={errors.booking_date} />
          </div>

          {/* Section 3: Document Uploads */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-1">Required Documents</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Profile', name: 'photo', icon: User },
                { label: 'Tazkira', name: 'tazkira_photo', icon: FileText },
                { label: 'License', name: 'driving_license_photo', icon: CreditCard },
              ].map((file) => (
                <div key={file.name} className="flex flex-col">
                  <div className="relative group">
                    <input 
                      type="file" name={file.name}
                      onChange={handleFileChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    />
                    <div className={`
                      h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all
                      ${customerData[file.name] 
                        ? 'border-emerald-500 bg-emerald-500/5 text-emerald-500' 
                        : errors[file.name]
                          ? 'border-rose-500/50 bg-rose-500/5 text-rose-500'
                          : 'border-white/10 bg-white/5 text-slate-500 group-hover:border-emerald-500/50'}
                    `}>
                      {customerData[file.name] ? <CheckCircle2 size={24} /> : <file.icon size={24} />}
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-center px-2">
                        {customerData[file.name] ? 'Uploaded' : `Upload ${file.label}`}
                      </span>
                    </div>
                  </div>
                  <ErrorMsg error={errors[file.name]} />
                </div>
              ))}
            </div>
          </div>

          {/* Info Footer */}
          <div className="flex items-start gap-3 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
            <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your data is encrypted and used only for verification purposes. Our team in Jalalabad will contact you shortly after confirmation.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold uppercase text-xs tracking-widest transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-[2] py-4 bg-emerald-500 hover:bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
              <CheckCircle2 size={16} />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingModal;