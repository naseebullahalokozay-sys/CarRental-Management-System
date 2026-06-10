import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useRef } from "react";
import { motion } from "framer-motion";

export default function Table({ columns, data, onEdit, onDelete, actions = true, customActions, isLoading }) {
  const { t } = useLanguage();
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  // Drag-to-scroll logic
  const handleMouseDown = (e) => {
    isDown.current = true;
    startY.current = e.pageY - scrollRef.current.offsetTop;
    scrollTop.current = scrollRef.current.scrollTop;
  };

  const handleMouseLeave = () => (isDown.current = false);
  const handleMouseUp = () => (isDown.current = false);

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const y = e.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY.current) * 1.5;
    scrollRef.current.scrollTop = scrollTop.current - walk;
  };

  if(isLoading){
    return (
      <div className="bg-[#111317] rounded-[2rem] border border-white/5 p-20 text-center shadow-2xl">
        <div className="inline-flex p-4 rounded-full bg-white/5 mb-4 text-slate-500">
          <MoreHorizontal size={32} />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          {t("common.loading")}
        </p>
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#111317] rounded-[2rem] border border-white/5 p-20 text-center shadow-2xl">
        <div className="inline-flex p-4 rounded-full bg-white/5 mb-4 text-slate-500">
          <MoreHorizontal size={32} />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          {t("common.noData")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#111317] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col h-[75vh] shadow-2xl shadow-black/50">
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1 cursor-grab active:cursor-grabbing"
      >
        <table className="w-full text-left border-collapse">
          {/* HEADER */}
          <thead className="sticky top-0 z-20 bg-[#16191d]/95 backdrop-blur-xl border-b border-white/10">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-8 py-5 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]"
                >
                  {column.label}
                </th>
              ))}

              {(actions || customActions) && (
                <th className="px-8 py-5 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] text-right">
                  {t("common.actions")}
                </th>
              )}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-white/5">
            {data.map((row, rowIndex) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.03 }}
                key={row.id || rowIndex} 
                className="group hover:bg-emerald-500/[0.02] transition-colors"
              >
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className={`px-8 py-5 whitespace-nowrap text-sm font-medium ${
                      column.isNumeric ? 'font-mono text-emerald-400' : 'text-slate-300'
                    }`}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}

                {(actions || customActions) && (
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {customActions && customActions(row)}

                      {actions && (
                        <div className="flex gap-1 bg-white/5 p-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/5">
                          {onEdit && (
                            <button 
                              onClick={() => onEdit(row)} 
                              className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                              title={t("common.edit")}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}

                          {onDelete && (
                            <button 
                              onClick={() => onDelete(row)} 
                              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title={t("common.delete")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}