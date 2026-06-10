import { Upload } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const baseInputStyles = "w-full px-4 py-3 bg-[#0a0b0d] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all disabled:bg-white/5 disabled:cursor-not-allowed disabled:text-slate-500";
const labelStyles = "block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1";

export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className={labelStyles}>
        {label} {required && <span className="text-emerald-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={type === "file" ? undefined : value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={baseInputStyles}
      />
    </div>
  )
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  placeholder = 'Select...',
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className={labelStyles}>
        {label} {required && <span className="text-emerald-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`${baseInputStyles} appearance-none cursor-pointer`}
        >
          <option value="" className="bg-[#111317]">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#111317]">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
    </div>
  )
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className={labelStyles}>
        {label} {required && <span className="text-emerald-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`${baseInputStyles} resize-none`}
      />
    </div>
  )
}

export function FormFileUpload({ label, name, onChange, accept, required = false }) {
  const { t } = useLanguage()
  
  return (
    <div className="space-y-1">
      <label className={labelStyles}>
        {label} {required && <span className="text-emerald-500">*</span>}
      </label>
      <label
        htmlFor={name}
        className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="p-3 bg-white/5 rounded-full mb-3 group-hover:bg-emerald-500/10 transition-colors">
            <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
          </div>
          <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors font-medium">
             {t('common.upload') || "Click to upload document"}
          </p>
          <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold tracking-tighter">
            {accept ? accept.replace(/\./g, ' ') : "Any file type"}
          </p>
        </div>
        <input
          type="file"
          id={name}
          name={name}
          onChange={onChange}
          accept={accept}
          required={required}
          className="hidden"
        />
      </label>
    </div>
  )
}

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  className = '',
}) {
  const variants = {
    primary: 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20',
    secondary: 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20',
    success: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black border border-emerald-500/20',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function FormGroup({ children, cols = 1 }) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }

  return <div className={`grid ${gridCols[cols]} gap-6`}>{children}</div>
}