import { useEffect, useState, useRef } from "react";
import { User, Receipt, Calendar, Wallet, ArrowRight, History } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import Table from "../components/Table";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import { FormInput, FormSelect, FormGroup } from "../components/Form";
import { ownerPaymentApi, ownerApi } from "../services/api";
import { motion } from "framer-motion";

export default function OwnerPayments() {
  const { t } = useLanguage();

  const [payments, setPayments] = useState([]);
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [errors, setErrors] = useState({}); // ✅ NEW

  const [formData, setFormData] = useState({
    ownerId: "",
    amount: "",
    paymentDate: "",
    receiptNo: "",
  });

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
    { key: "ownerName", label: t("ownerPayment.owner") },
    { key: "amount", label: t("ownerPayment.amount"), render: (val) => `${val} AFG` },
    { key: "paymentDate", label: t("ownerPayment.paymentDate"), render: (val) => formatDisplayDate(val) },
    { key: "receiptNo", label: t("ownerPayment.receiptNo"), render: (val) => val.toUpperCase() },
  ];

  const scrollRef = useRef(null);

  useEffect(() => {
    fetchPayment();
    fetchOwner();
  }, []);

  const fetchPayment = async () => {
    setIsLoading(true);
    try {
      const res = await ownerPaymentApi.getAll();

      const formatted = (res.data?.data || []).map((p) => ({
        id: p.id,
        ownerId: p.owner_id,
        ownerName: p.owner?.name || "",
        amount: Number(p.amount_paid),
        paymentDate: p.payment_date,
        receiptNo: p.receipt_no,
      }));

      setPayments(formatted);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOwner = async () => {
    try {
      const res = await ownerApi.getAll();
      setOwners(res.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const ErrorText = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">
        {errors[field][0]}
      </p>
    ) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // reset errors

    try {
      const payload = {
        owner_id: formData.ownerId,
        amount_paid: formData.amount,
        payment_date: formData.paymentDate,
        receipt_no: `RCP-${formData.receiptNo}`,
      };

      await ownerPaymentApi.create(payload);

      fetchPayment();

      setIsModalOpen(false);

      setFormData({
        ownerId: "",
        amount: "",
        paymentDate: "",
        receiptNo: "",
      });
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) setErrors(apiErrors);
      else console.error("Submission error", err.response?.data);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

      {/* Header */}
      <div className="bg-[#111317] p-2 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <PageHeader
          title={t("ownerPayment.title")}
          onAdd={() => {
            setErrors({});
            setFormData({
              ownerId: "",
              amount: "",
              paymentDate: "",
              receiptNo: "",
            });
            setIsModalOpen(true);
          }}
          addLabel={t("ownerPayment.addPayment")}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={payments.filter((p) =>
          p.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        actions={false}
        isLoading={isLoading}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("ownerPayment.addPayment")}
      >
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">

            {/* Owner */}
            <div>
              <FormSelect
                label={t("ownerPayment.owner")}
                name="ownerId"
                value={formData.ownerId}
                onChange={(e) =>
                  setFormData({ ...formData, ownerId: e.target.value })
                }
                options={owners.map((o) => ({
                  value: o.id,
                  label: o.name,
                }))}
                required
              />
              <ErrorText field="owner_id" />
            </div>

            {/* Amount */}
            <div>
              <FormInput
                label={t("ownerPayment.amount")}
                name="amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
              <ErrorText field="amount_paid" />
            </div>

            {/* Date */}
            <div>
              <FormInput
                label={t("ownerPayment.paymentDate")}
                name="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) =>
                  setFormData({ ...formData, paymentDate: e.target.value })
                }
                required
              />
              <ErrorText field="payment_date" />
            </div>

            {/* Receipt */}
            <div>
              <FormInput
                label={t("ownerPayment.receiptNo")}
                name="receiptNo"
                type="text"
                value={formData.receiptNo}
                onChange={(e) =>
                  setFormData({ ...formData, receiptNo: e.target.value })
                }
                placeholder="e.g. 1024"
                required
              />
              <ErrorText field="receipt_no" />
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 text-xs font-black uppercase text-slate-500 hover:text-white"
            >
              {t("common.cancel")}
            </button>

            <button
              type="submit"
              className="px-10 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black uppercase tracking-widest"
            >
              {t("common.save")}
            </button>
          </div>

        </form>
      </Modal>
    </motion.div>
  );
}