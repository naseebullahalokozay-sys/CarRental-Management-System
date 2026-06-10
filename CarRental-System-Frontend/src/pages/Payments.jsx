import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Landmark, User, Calendar, Receipt, ChevronRight,Printer } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import Table from "../components/Table";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import { FormInput, FormSelect, FormGroup } from "../components/Form";
import { paymentApi, rentalApi } from "../services/api";
import { motion } from "framer-motion";

export default function Payments() {
  const navigate = useNavigate()
  const { t } = useLanguage();
  const [payments, setPayments] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    rentalId: "",
    amountPaid: "",
    paymentDate: "",
  });

  const formatDisplayDate = (date) => {
    if (!date) return "-";
    const cleaned = date.replace(" ", "T").replace("Z:00", "Z");
    return new Date(cleaned).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
      key: "amountPaid",
      label: t("payment.amountPaid"),
      render: (val) => (
        <div className="font-mono text-xs font-bold text-emerald-400">
          {val} <span className="text-[9px] opacity-50 uppercase">AFG</span>
        </div>
      ),
    },
    {
      key: "remainingBalance",
      label: t("payment.remainingBalance") || "Balance",
      render: (val) => (
        <div className={`font-mono text-xs ${val > 0 ? "text-red-400" : "text-slate-500"}`}>
          {val ?? 0} <span className="text-[9px] opacity-50 uppercase">AFG</span>
        </div>
      ),
    },
    {
      key: "paymentMethod",
      label: t("Recive"),
      render: (val) => {
        const icons = { cash: <Wallet size={12} />, card: <CreditCard size={12} />, transfer: <Landmark size={12} /> };
        const colors = {
          cash: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        };
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-widest ${colors[val] || colors.cash}`}>
            {icons[val] || icons.cash}
            {t(`payment.${val}`)}
          </span>
        );
      },
    },
    {
      key: "paymentDate",
      label: t("payment.paymentDate"),
      render: (val) => (
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
          <Calendar size={12} className="text-slate-600" />
          {formatDisplayDate(val)}
        </div>
      ),
    },
    {
      key: "actions",
      label: t("common.actions") || "Actions",
      render: (_, row) => (
        <button
          onClick={() => navigate(`/admin/invoice/${row.id}`)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter"
        >
          <Printer size={12} />
          {t("print") || "Print"}
        </button>
      ),
    },
  ];

  useEffect(() => {
    fetchPayment();
    fetchRental();
  }, []);

  const fetchPayment = async () => {
    try {
      const res = await paymentApi.getAll();
      const data = res.data?.data || res.data || [];
      const formatted = data.map((payment) => ({
        id: payment.id,
        rentalId: payment.rental_id,
        customer: payment.rental?.booking.customer?.name || "N/A",
        amountPaid: payment.amount_paid,
        remainingBalance: payment.remaining_balance,
        paymentMethod: payment.payment_method,
        paymentDate: payment.payment_date,
      }));
      setPayments(formatted);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const fetchRental = async () => {
    setIsLoading(true);
    try {
      const res = await rentalApi.getAll();
      const data = res.data?.data || res.data || [];
      setRentals(data);
    } catch (err) {
      console.error("Fetch rentals error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        rental_id: parseInt(formData.rentalId),
        amount_paid: parseFloat(formData.amountPaid),
        payment_method: "cash",
        payment_date: formData.paymentDate,
      };
      await paymentApi.create(payload);
      fetchPayment();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Submission error", err.response?.data);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-[#111317] p-2 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <PageHeader
          title={t("payment.title")}
          onAdd={() => {
            setFormData({ rentalId: "", amountPaid: "", paymentDate: "" });
            setIsModalOpen(true);
          }}
          addLabel={t("payment.addPayment")}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <Table columns={columns} data={payments.filter((p) => p.customer?.toLowerCase().includes(searchQuery.toLowerCase()))} actions={false} isLoading={isLoading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t("payment.addPayment")}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
            <FormSelect
              label={t("rental.title")}
              name="rentalId"
              value={formData.rentalId}
              onChange={handleChange}
              options={rentals.map((r) => ({
                value: r.id,
                label: `${r.booking.customer?.name || "N/A"} — ${r.booking.car?.model || ""} [Total: ${r.total_amount} AFG]`,
              }))}
              required
            />
            <FormGroup cols={1}>
              <FormInput label={t("payment.amountPaid")} name="amountPaid" type="number" value={formData.amountPaid} onChange={handleChange} required />
              {/* <FormSelect 
                label={t("payment.paymentMethod")} 
                name="paymentMethod" 
                value={formData.paymentMethod} 
                onChange={handleChange} 
                options={formData.paymentMethod} 
                required 
              /> */}
            </FormGroup>
            <FormInput label={t("payment.paymentDate")} name="paymentDate" type="date" value={formData.paymentDate} onChange={handleChange} required />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-xs font-black uppercase text-slate-500 hover:text-white transition-colors">
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="px-10 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Receipt size={14} />
              {t("common.save")}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
