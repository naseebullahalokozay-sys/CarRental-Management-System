import { X } from 'lucide-react'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          {/* Glass Overlay Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className={`relative w-full ${sizeClasses[size]} z-[101] outline-none focus:outline-none`}
          >
            <div className="relative flex flex-col w-full bg-[#111317] border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                <h3 className="text-xl font-black text-white tracking-tight uppercase italic italic-none">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-slate-400 rounded-full border border-white/5 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
                <div className="text-slate-300">
                  {children}
                </div>
              </div>

              {/* Subtle Bottom Accent Line */}
              <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-50" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}