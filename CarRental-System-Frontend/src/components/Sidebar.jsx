import { NavLink } from "react-router-dom";
import authApi from "../services/api";
import { LogOut, LayoutDashboard, Users, Car, UserCircle, Calendar, Clock, CreditCard, Shield, Wallet, X, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { path: "/admin/dashboard", icon: LayoutDashboard, labelKey: "app.dashboard" },
  { path: "/admin/owners", icon: Users, labelKey: "app.carOwners" },
  { path: "/admin/cars", icon: Car, labelKey: "app.cars" },
  { path: "/admin/customers", icon: UserCircle, labelKey: "app.customers" },
  { path: "/admin/bookings", icon: Calendar, labelKey: "app.bookings" },
  { path: "/admin/rentals", icon: Clock, labelKey: "app.rentals" },
  { path: "/admin/payments", icon: CreditCard, labelKey: "app.payments" },
  { path: "/admin/guarantees", icon: Shield, labelKey: "app.guarantees" },
  { path: "/admin/owner-payments", icon: Wallet, labelKey: "app.ownerPayments" },
];

export default function Sidebar({ isOpen, onClose }) {
  const { t, isRTL } = useLanguage();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error.message);
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/home";
    }
  };

  // Logic to determine if we should animate or stay static
  const isMobile = window.innerWidth < 1024;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        // On Desktop, we don't want it hidden, so we remove the 'closed' x-translation
        initial={isMobile ? { x: isRTL ? "100%" : "-100%" } : { x: 0 }}
        animate={isMobile ? (isOpen ? { x: 0 } : { x: isRTL ? "100%" : "-100%" }) : { x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed top-0 ${isRTL ? "right-0" : "left-0"} h-full w-72 bg-[#111317] border-x border-white/5 z-[70] 
          lg:relative lg:translate-x-0 flex flex-col shadow-2xl
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Shield className="text-[#090a0c] w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black italic uppercase tracking-tighter text-white">
              VMS <span className="text-emerald-500 text-xs not-italic tracking-widest ml-1 opacity-80">PRO</span>
            </span>
          </div>
          <button onClick={onClose} className="p-2 lg:hidden text-slate-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.25em] mb-4 text-center lg:text-left">Main Menu</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && onClose()}
              className={({ isActive }) => `
                relative group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300
                ${isActive ? "bg-emerald-500/10 text-emerald-400" : "text-slate-500 hover:bg-white/5 hover:text-white"}
              `}
            >
              <div className="flex items-center gap-4 z-10">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-bold tracking-wide">{t(item.labelKey)}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
          <button onClick={handleLogout} className="flex items-center gap-4 w-full px-5 py-4 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-black uppercase tracking-widest">Termination</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}