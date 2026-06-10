import { Menu, Globe, Car, ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useState } from "react";
import AdminRegister from "../pages/AdminRegister";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "en", name: "English", flag: "EN" },
  { code: "fa", name: "دری", flag: "FA" },
  { code: "ps", name: "پښتو", flag: "PS" },
];

export default function Navbar({ onMenuClick }) {
  const { language, setLanguage, t } = useLanguage();
  const [showAdminRegister, setShowAdminRegister] = useState(false);

  return (
    <nav className="bg-[#111317]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-[40]">
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Section: Logo & Menu */}
          <div className="flex items-center gap-6">
            <button 
              onClick={onMenuClick} 
              className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all" 
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-slate-400" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Car className="w-6 h-6 text-black stroke-[2.5px]" />
              </div>
              <div className="flex flex-col leading-none hidden sm:block">
                <span className="text-lg font-black text-white tracking-tighter uppercase italic">
                  {t("app.title")}
                </span>
                <span className="text-[9px] font-black text-emerald-500 tracking-[0.2em] uppercase mt-0.5 ml-0.5">
                  Management
                </span>
              </div>
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-4">
            
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAdminRegister(true)}
              className="hidden md:flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-emerald-500/10"
            >
              Join Member
            </motion.button>

            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all duration-300">
                <Globe className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                <span className="text-xs font-black text-white uppercase tracking-tighter">
                  {languages.find((l) => l.code === language)?.flag}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-3 w-44 bg-[#111317] rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                <div className="py-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`w-full px-5 py-3 text-left text-xs font-bold transition-all flex items-center justify-between ${
                        language === lang.code 
                          ? "bg-emerald-500 text-black" 
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {lang.name}
                      {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin Register Modal */}
            <AdminRegister isOpen={showAdminRegister} onClose={() => setShowAdminRegister(false)} />
          </div>
        </div>
      </div>
    </nav>
  );
}