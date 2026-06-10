import { useEffect, useState } from "react";
import { Play, Square, User, Car, Clock, Timer } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import Table from "../components/Table";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { FormInput, FormSelect, Button, FormGroup } from "../components/Form";
import { rentalApi, bookingApi } from "../services/api";
import { motion } from "framer-motion";

export default function Rentals() {
  const { t } = useLanguage();
  const [rentals, setRentals] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [startFormData, setStartFormData] = useState({ bookingId: "", startTime: "" });
  const [endFormData, setEndFormData] = useState({ endTime: "", discount: "0", fineAmount: "0" });

  // NEW: error states
  const [startErrors, setStartErrors] = useState({});
  const [endErrors, setEndErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const formatDisplayDate = (date) => {
    if (!date) return "-";
    const cleaned = date.replace(" ", "T").replace("Z:00", "Z");
    return new Date(cleaned).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      key: "customer",
      label: t("booking.customer"),
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <User size={14} />
          </div>
          <span className="font-bold text-white tracking-tight">{val}</span>
        </div>
      ),
    },
    {
      key: "car",
      label: t("booking.car"),
      render: (val) => (
        <div className="flex items-center gap-2 text-slate-300">
          <Car size={14} className="text-emerald-500/50" />
          <span className="text-[11px] uppercase font-black tracking-widest">{val}</span>
        </div>
      ),
    },
    {
      key: "startTime",
      label: t("rental.startTime"),
      render: (val) => (
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
          <Clock size={12} className="text-emerald-500/40" />
          {formatDisplayDate(val)}
        </div>
      ),
    },
    {
      key: "totalHours",
      label: t("rental.totalHours"),
      render: (val) =>
        val ? (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-xs">
            <Timer size={12} /> {val}h
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "totalAmount",
      label: t("rental.totalAmount"),
      render: (val) =>
        val ? (
          <div className="font-mono text-xs font-bold text-white">
            {val} <span className="text-[9px] text-emerald-500/50">AFG</span>
          </div>
        ) : (
          <span className="text-slate-600 italic text-[10px]">Pending end</span>
        ),
    },
    {
      key: "status",
      label: t("common.status"),
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  useEffect(() => {
    fetchRentals();
    fetchBookings();
  }, []);

  const fetchRentals = async () => {
    setIsLoading(true);
    try {
      const res = await rentalApi.getAll();
      const raw = res.data?.data ?? res.data;
      const formatted = Array.isArray(raw)
        ? raw.map((rental) => ({
            id: rental.id,
            customer: rental.booking?.customer?.name || "No Customer",
            car: rental.booking?.car?.model || "No Car",
            startTime: rental.start_time,
            endTime: rental.end_time,
            totalHours: rental.total_hours,
            totalAmount: rental.total_amount,
            discount: rental.discount,
            fineAmount: rental.fine_amount,
            status: rental.booking?.status || "pending",
          }))
        : [];
      setRentals(formatted);
    } catch (err) {
      setApiError(err?.response?.data?.message || "Failed to fetch rentals");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await bookingApi.getAll();
      const raw = res.data?.data ?? res.data;
      setBookings(Array.isArray(raw) ? raw : []);
    } catch {
      setBookings([]);
    }
  };

  // VALIDATION
  const validateStart = () => {
    const errors = {};
    if (!startFormData.bookingId) errors.bookingId = "Booking is required";
    if (!startFormData.startTime) errors.startTime = "Start time is required";
    setStartErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEnd = () => {
    const errors = {};

    if (!endFormData.endTime) {
      errors.endTime = "End time is required";
    } else {
      const start = new Date(selectedRental.startTime);
      const end = new Date(endFormData.endTime);
      if (end <= start) {
        errors.endTime = "End time must be after start time";
      }
    }

    if (endFormData.discount < 0) errors.discount = "Invalid discount";
    if (endFormData.fineAmount < 0) errors.fineAmount = "Invalid fine";

    setEndErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStartSubmit = async (e) => {
    e.preventDefault();
    if (!validateStart()) return;

    try {
      await rentalApi.create({
        booking_id: startFormData.bookingId,
        start_time: startFormData.startTime,
      });
      fetchRentals();
      setIsStartModalOpen(false);
      setStartErrors({});
    } catch (err) {
      setStartErrors(err?.response?.data?.errors || { general: "Start failed" });
    }
  };

  const handleEndSubmit = async (e) => {
    e.preventDefault();
    if (!validateEnd()) return;

    try {
      await rentalApi.end(selectedRental.id, {
        end_time: endFormData.endTime,
        discount: Number(endFormData.discount) || 0,
        fine_amount: Number(endFormData.fineAmount) || 0,
      });
      fetchRentals();
      setIsEndModalOpen(false);
      setEndErrors({});
    } catch (err) {
      setEndErrors(err?.response?.data?.errors || { general: "End failed" });
    }
  };

  const customActions = (row) =>
    row.status === "confirmed" ? (
      <button
        onClick={() => {
          setSelectedRental(row);
          setEndFormData({ endTime: "", discount: "0", fineAmount: "0" });
          setIsEndModalOpen(true);
        }}
        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
      >
        <Square size={12} className="fill-current" />
        <span className="text-[10px] font-black uppercase tracking-tighter">End Trip</span>
      </button>
    ) : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {apiError && <div className="text-red-500 text-xs">{apiError}</div>}

      <div className="bg-[#111317] p-2 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <PageHeader
          title={t("rental.title")}
          onAdd={() => {
            setStartFormData({ bookingId: "", startTime: "" });
            setIsStartModalOpen(true);
          }}
          addLabel={t("rental.startRental")}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <Table
        columns={columns}
        data={rentals.filter(
          (r) =>
            r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.car.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        actions={false}
        customActions={customActions}
        isLoading={isLoading}
      />

      <Modal isOpen={isStartModalOpen} onClose={() => setIsStartModalOpen(false)} title={t("rental.startRental")}>
        <form onSubmit={handleStartSubmit} className="space-y-6">
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
            <FormSelect
              label={t("booking.title")}
              name="bookingId"
              value={startFormData.bookingId}
              onChange={(e) => setStartFormData({ ...startFormData, bookingId: e.target.value })}
              options={bookings
                .filter((b) => b.status === "confirmed")
                .map((b) => ({ value: b.id, label: `${b.customer?.name} - ${b.car?.model}` }))}
              required
            />
            {startErrors.bookingId && <p className="text-red-500 text-xs">{startErrors.bookingId}</p>}

            <FormInput
              label={t("rental.startTime")}
              type="datetime-local"
              value={startFormData.startTime}
              onChange={(e) => setStartFormData({ ...startFormData, startTime: e.target.value })}
              required
            />
            {startErrors.startTime && <p className="text-red-500 text-xs">{startErrors.startTime}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsStartModalOpen(false)} className="px-6 py-2 text-xs font-black uppercase text-slate-500 hover:text-white">
              {t("common.cancel")}
            </button>
            <button type="submit" className="px-10 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black uppercase tracking-widest">
              <Play size={14} className="fill-current" /> {t("rental.startRental")}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEndModalOpen} onClose={() => setIsEndModalOpen(false)} title="Finalize Trip">
        <form onSubmit={handleEndSubmit} className="space-y-6">
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
            <FormInput
              label={t("rental.endTime")}
              type="datetime-local"
              value={endFormData.endTime}
              onChange={(e) => setEndFormData({ ...endFormData, endTime: e.target.value })}
              required
            />
            {endErrors.endTime && <p className="text-red-500 text-xs">{endErrors.endTime}</p>}

            <FormGroup cols={2}>
              <FormInput
                label="Discount (AFG)"
                type="number"
                value={endFormData.discount}
                onChange={(e) => setEndFormData({ ...endFormData, discount: e.target.value })}
              />
              <FormInput
                label="Fine (AFG)"
                type="number"
                value={endFormData.fineAmount}
                onChange={(e) => setEndFormData({ ...endFormData, fineAmount: e.target.value })}
              />
            </FormGroup>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsEndModalOpen(false)} className="px-6 py-2 text-xs font-black uppercase text-slate-500 hover:text-white">
              {t("common.cancel")}
            </button>
            <button type="submit" className="px-10 py-3 bg-red-500 hover:bg-red-400 text-white rounded-xl text-xs font-black uppercase tracking-widest">
              <Square size={14} className="fill-current" /> {t("rental.endRental")}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
