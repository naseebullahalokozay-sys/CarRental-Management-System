import { useEffect, useState } from "react";
import {
  Unlock,
  Lock,
  User,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Briefcase,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import Table from "../components/Table";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

import {
  FormInput,
  FormSelect,
  FormFileUpload,
  FormGroup,
} from "../components/Form";

import { guaranteeApi, rentalApi } from "../services/api";

import { motion, AnimatePresence } from "framer-motion";

const typeOptions = [
  { value: "guarantor", label: "Guarantor" },
  { value: "item", label: "Item" },
];

export default function Guarantees() {
  const { t } = useLanguage();

  const [guarantees, setGuarantees] = useState([]);
  const [rentals, setRentals] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    rentalId: "",
    type: "guarantor",
    guarantorName: "",
    itemDescription: "",
    document: null,
  });

  // Validation States
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    fetchGuarantee();
    fetchRental();
  }, []);

  const fetchGuarantee = async () => {
    setIsLoading(true);

    try {
      const res = await guaranteeApi.getAll();

      const data = res.data?.data || res.data || [];

      setGuarantees(data);

    } catch (err) {
      console.error("Fetch error:", err);

    } finally {
      setIsLoading(false);
    }
  };

  const fetchRental = async () => {
    try {
      const res = await rentalApi.getAll();

      const data = res.data?.data || res.data || [];

      setRentals(data);

    } catch (err) {
      console.error("Fetch rentals error:", err);
    }
  };

  const columns = [
    {
      key: "customer",

      label: t("booking.customer"),

      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <User size={14} />
          </div>

          <span className="font-bold text-white tracking-tight">
            {row.booking?.customer?.name || "-"}
          </span>
        </div>
      ),
    },

    {
      key: "type",

      label: t("guarantee.type"),

      render: (val) => {
        const isGuarantor = val === "guarantor";

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-widest ${
              isGuarantor
                ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
                : "text-purple-400 bg-purple-400/10 border-purple-400/20"
            }`}
          >
            {isGuarantor ? (
              <ShieldCheck size={12} />
            ) : (
              <Briefcase size={12} />
            )}

            {t(`guarantee.${val}`)}
          </span>
        );
      },
    },

    {
      key: "detail",

      label: t("detail"),

      render: (_, row) => (
        <div className="text-slate-300 text-xs font-medium max-w-[200px] truncate">
          {row.description}
        </div>
      ),
    },

    {
      key: "photo",

      label: t("guarantee.document"),

      render: (val) =>
        val ? (
          <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase">
            <ImageIcon
              size={14}
              className="opacity-50"
            />

            {t("uploaded") || "Verified"}
          </div>
        ) : (
          <span className="text-slate-600 italic text-[10px]">
            No Attachment
          </span>
        ),
    },

    {
      key: "status",

      label: t("common.status"),

      render: (val) => (
        <StatusBadge
          status={val}
          label={t(`guarantee.${val}`)}
        />
      ),
    },
  ];

  // Add
  const handleAdd = () => {
    setFormData({
      rentalId: "",
      type: "guarantor",
      guarantorName: "",
      itemDescription: "",
      document: null,
    });

    setErrors({});
    setGeneralError("");

    setIsModalOpen(true);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setGeneralError("");

    try {
      const form = new FormData();

      form.append("booking_id", formData.rentalId);

      form.append("type", formData.type);

      form.append(
        "description",
        formData.type === "guarantor"
          ? formData.guarantorName
          : formData.itemDescription
      );

      if (formData.document) {
        form.append("photo", formData.document);
      }

      await guaranteeApi.create(form);

      fetchGuarantee();

      setIsModalOpen(false);

    } catch (err) {
      console.error(
        "Submission error:",
        err.response?.data
      );

      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setGeneralError(
          err.response?.data?.message ||
            "Something went wrong while saving guarantee."
        );
      }
    }
  };

  // Toggle Status
  const toggleStatus = async (guarantee) => {
    try {
      const newStatus =
        guarantee.status === "locked"
          ? "released"
          : "locked";

      await guaranteeApi.update(guarantee.id, {
        status: newStatus,
      });

      fetchGuarantee();

    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  // Actions
  const customActions = (row) => (
    <button
      onClick={() => toggleStatus(row)}
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 border ${
        row.status === "locked"
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-black"
          : "bg-orange-500/10 border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white"
      }`}
    >
      {row.status === "locked" ? (
        <Unlock size={12} className="fill-current" />
      ) : (
        <Lock size={12} className="fill-current" />
      )}

      <span className="text-[10px] font-black uppercase tracking-tighter">
        {row.status === "locked"
          ? t("guarantee.released")
          : t("guarantee.locked")}
      </span>
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-[#111317] p-2 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <PageHeader
          title={t("guarantee.title")}
          onAdd={handleAdd}
          addLabel={t("guarantee.addGuarantee")}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <Table
        columns={columns}
        data={guarantees.filter(
          (g) =>
            g.booking?.customer?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            g.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        )}
        actions={false}
        customActions={customActions}
        isLoading={isLoading}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("guarantee.addGuarantee")}
        size="lg"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* General Error */}
          {generalError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-2xl px-4 py-3">
              {generalError}
            </div>
          )}

          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">

            <FormGroup cols={2}>

              {/* Rental */}
              <div>
                <FormSelect
                  label={t("rental.title")}
                  name="rentalId"
                  value={formData.rentalId}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      rentalId: e.target.value,
                    });

                    setErrors((prev) => ({
                      ...prev,
                      booking_id: null,
                    }));
                  }}
                  options={rentals.map((r) => ({
                    value: r.id,
                    label: `${r.booking.customer?.name} - ${r.booking.car?.model}`,
                  }))}
                  required
                />

                {errors.booking_id && (
                  <div className="mt-2 space-y-1">
                    {errors.booking_id.map(
                      (err, index) => (
                        <p
                          key={index}
                          className="text-red-400 text-[11px] font-medium"
                        >
                          {err}
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Type */}
              <div>
                <FormSelect
                  label={t("guarantee.type")}
                  name="type"
                  value={formData.type}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      type: e.target.value,
                    });

                    setErrors((prev) => ({
                      ...prev,
                      type: null,
                    }));
                  }}
                  options={typeOptions}
                  required
                />

                {errors.type && (
                  <div className="mt-2 space-y-1">
                    {errors.type.map((err, index) => (
                      <p
                        key={index}
                        className="text-red-400 text-[11px] font-medium"
                      >
                        {err}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </FormGroup>

            {/* Animated Field */}
            <AnimatePresence mode="wait">
              <motion.div
                key={formData.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >

                {formData.type === "guarantor" ? (
                  <div>
                    <FormInput
                      label={t("guarantee.guarantor")}
                      name="guarantorName"
                      value={formData.guarantorName}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          guarantorName:
                            e.target.value,
                        });

                        setErrors((prev) => ({
                          ...prev,
                          description: null,
                        }));
                      }}
                      placeholder="Enter guarantor name"
                      required
                    />

                    {errors.description && (
                      <div className="mt-2 space-y-1">
                        {errors.description.map(
                          (err, index) => (
                            <p
                              key={index}
                              className="text-red-400 text-[11px] font-medium"
                            >
                              {err}
                            </p>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <FormInput
                      label={t("guarantee.item")}
                      name="itemDescription"
                      value={formData.itemDescription}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          itemDescription:
                            e.target.value,
                        });

                        setErrors((prev) => ({
                          ...prev,
                          description: null,
                        }));
                      }}
                      placeholder="Describe the item (e.g. Passport, ID Card)"
                      required
                    />

                    {errors.description && (
                      <div className="mt-2 space-y-1">
                        {errors.description.map(
                          (err, index) => (
                            <p
                              key={index}
                              className="text-red-400 text-[11px] font-medium"
                            >
                              {err}
                            </p>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* File Upload */}
            <div>
              <FormFileUpload
                label={t("guarantee.document")}
                name="document"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    document: e.target.files[0],
                  });

                  setErrors((prev) => ({
                    ...prev,
                    photo: null,
                  }));
                }}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />

              {errors.photo && (
                <div className="mt-2 space-y-1">
                  {errors.photo.map((err, index) => (
                    <p
                      key={index}
                      className="text-red-400 text-[11px] font-medium"
                    >
                      {err}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 text-xs font-black uppercase text-slate-500 hover:text-white transition-colors"
            >
              {t("common.cancel")}
            </button>

            <button
              type="submit"
              className="px-10 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <FileText size={14} />

              {t("common.save")}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}