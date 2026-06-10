import { Plus, Search } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { motion } from 'framer-motion'

export default function PageHeader({
  title,
  onAdd,
  addLabel,
  searchValue,
  onSearchChange,
  showSearch = true,
}) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 px-6 py-4">
      {/* Title Section */}
      <div className="flex items-center gap-4">
        <div className="h-8 w-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic italic-none">
          {t(title)}
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Modern Search Bar */}
        {showSearch && (
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder={t('common.search') || "Search records..."}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full sm:w-72 pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 focus:bg-white/[0.08] transition-all"
            />
          </div>
        )}

        {/* Action Button */}
        {onAdd && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAdd}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-black rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>{addLabel}</span>
          </motion.button>
        )}
      </div>
    </div>
  )
}