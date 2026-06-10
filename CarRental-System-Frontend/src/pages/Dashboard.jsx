import { Car, Users, Clock, DollarSign, ArrowUpRight, Activity } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { dashboardApi } from "../services/api";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function StatCard({ icon: Icon, label, value, color }) {
  // Mapping our Emerald theme colors
  const glowColors = {
    blue: "shadow-[0_0_20px_rgba(59,130,246,0.15)] border-blue-500/20",
    green: "shadow-[0_0_20px_rgba(16,185,129,0.15)] border-emerald-500/20",
    orange: "shadow-[0_0_20px_rgba(249,115,22,0.15)] border-orange-500/20",
    purple: "shadow-[0_0_20px_rgba(168,85,247,0.15)] border-purple-500/20",
  };

  const iconColors = {
    blue: "text-blue-400 bg-blue-400/10",
    green: "text-emerald-400 bg-emerald-400/10",
    orange: "text-orange-400 bg-orange-400/10",
    purple: "text-purple-400 bg-purple-400/10",
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-[#111317] rounded-[2rem] p-6 border ${glowColors[color]} transition-all`}
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${iconColors[color]}`}>
          <Icon size={24} />
        </div>
        <ArrowUpRight className="text-slate-600" size={16} />
      </div>
      <div className="mt-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
        <p className="text-3xl font-black text-white mt-1 font-mono tracking-tighter">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const statusStyles = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    approved: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    completed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[status] || "bg-slate-800 text-slate-400"}`}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  const [stats, setState] = useState({
    totalCars: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    activeRentals: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const { t } = useLanguage();

  const formatDisplayDate = (date) => {
    if (!date) return "-";
    const cleaned = date.replace(" ", "T").replace("Z:00", "Z");
    return new Date(cleaned).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchStats();
    fetchRecentBooking();
    fetchRecentPayment();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardApi.getStats();
      setState({
        totalCars: res.data.totalCars,
        totalCustomers: res.data.totalCustomers,
        activeRentals: res.data.activeRentals,
        totalRevenue: Number(res.data.totalRevenue),
      });
    } catch (error) { console.error(error); }
  };

  // ... fetchRecentBooking and fetchRecentPayment logic remains the same
  const fetchRecentBooking = async () => {

    try {

      const res = await dashboardApi.getRecentBookings();

      const data = res.data;

      setRecentBookings(data);

    } catch (err) {

      console.error(err);

    }

  };

  const fetchRecentPayment = async () => {

    try {

      const res = await dashboardApi.getRecentPayments();

      const data = res.data;

      setRecentPayments(data);

    } catch (err) {

      console.error(err);

    }

  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            System <span className="text-emerald-500">Overview</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Live analytics and fleet monitoring.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-2xl">
          <Activity size={16} className="text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Car} label={t("dashboard.totalCars")} value={stats.totalCars} color="blue" />
        <StatCard icon={Users} label={t("dashboard.totalCustomers")} value={stats.totalCustomers} color="green" />
        <StatCard icon={Clock} label={t("dashboard.activeRentals")} value={stats.activeRentals} color="orange" />
        <StatCard icon={DollarSign} label={t("dashboard.totalRevenue")} value={`${stats.totalRevenue.toLocaleString()} AFG`} color="purple" />
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Recent Bookings Card */}
        <div className="bg-[#111317] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">{t("dashboard.recentBookings")}</h2>
            <button className="text-[10px] font-bold text-emerald-500 hover:text-white transition-colors uppercase tracking-widest">View All</button>
          </div>
          <div className="divide-y divide-white/5">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="px-8 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
                    {booking.customer?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{booking.customer}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{booking.car}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={booking.status} />
                  <p className="text-[10px] font-mono text-slate-600 mt-2">{formatDisplayDate(booking.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments Card */}
        <div className="bg-[#111317] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">{t("dashboard.recentPayments")}</h2>
            <button className="text-[10px] font-bold text-emerald-500 hover:text-white transition-colors uppercase tracking-widest">History</button>
          </div>
          <div className="divide-y divide-white/5">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="px-8 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white/5 text-slate-400">
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-white">{payment.customer}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{payment.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-emerald-400 font-mono tracking-tighter">
                    +${payment.amount}
                  </p>
                  <p className="text-[10px] font-mono text-slate-600 mt-1">{formatDisplayDate(payment.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}