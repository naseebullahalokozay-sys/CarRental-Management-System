import { useEffect, useState } from "react";
import {
  Eye,
  ShieldCheck,
  ShieldAlert,
  User,
  Smartphone,
  FileText,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import Table from "../components/Table";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  FormInput,
  FormFileUpload,
  Button,
  FormGroup,
} from "../components/Form";

import { customerApi } from "../services/api";
import { motion } from "framer-motion";

export default function Customers() {
  const { t } = useLanguage();

  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    tazkiraPhoto: null,
    photo: null,
    drivingLicense: null,
  });

  // Validation States
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  // Table Columns
  const columns = [
    {
      key: "name",
      label: t("customer.customerName"),

      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <User size={16} />
          </div>

          <span className="font-bold text-white tracking-tight">
            {val}
          </span>
        </div>
      ),
    },

    {
      key: "phone",
      label: t("common.phone"),

      render: (val) => (
        <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
          <Smartphone
            size={14}
            className="text-emerald-500/50"
          />

          {val}
        </div>
      ),
    },

    {
      key: "tazkiraPhoto",
      label: t("customer.tazkiraPhoto"),

      render: (val) =>
        val ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <ShieldCheck size={10} /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
            <ShieldAlert size={10} /> Missing
          </span>
        ),
    },

    {
      key: "drivingLicense",
      label: t("customer.drivingLicense"),

      render: (val) =>
        val ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <ShieldCheck size={10} /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
            Missing
          </span>
        ),
    },
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);

    try {
      const res = await customerApi.getAll();

      const data = res.data?.data || res.data || [];

      setCustomers(
        data.map((customer) => ({
          ...customer,

          photo: customer.photo,
          tazkiraPhoto: customer.tazkira_photo,
          drivingLicense:
            customer.driving_license_photo,
        }))
      );

    } catch (err) {
      console.error(err);

    } finally {
      setIsLoading(false);
    }
  };

  // Add
  const handleAdd = () => {
    setSelectedCustomer(null);

    setFormData({
      name: "",
      phone: "",
      tazkiraPhoto: null,
      photo: null,
      drivingLicense: null,
    });

    setErrors({});
    setGeneralError("");
    setIsModalOpen(true);
  };

  // Edit
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);

    setFormData({
      name: customer.name,
      phone: customer.phone,
      tazkiraPhoto: customer.tazkiraPhoto,
      photo: customer.photo,
      drivingLicense: customer.drivingLicense,
    });

    setErrors({});
    setGeneralError("");
    setIsModalOpen(true);
  };

  // Delete
  const handleDelete = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteOpen(true);
  };

  // View
  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setIsViewOpen(true);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setGeneralError("");

    const data = new FormData();

    data.append("name", formData.name);
    data.append("phone", formData.phone);

    if (selectedCustomer) {
      data.append("_method", "PUT");
    }

    if (formData.tazkiraPhoto instanceof File) {
      data.append(
        "tazkira_photo",
        formData.tazkiraPhoto
      );
    }

    if (formData.photo instanceof File) {
      data.append("photo", formData.photo);
    }

    if (formData.drivingLicense instanceof File) {
      data.append(
        "driving_license_photo",
        formData.drivingLicense
      );
    }

    try {
      if (selectedCustomer) {
        await customerApi.update(
          selectedCustomer.id,
          data
        );
      } else {
        await customerApi.create(data);
      }

      fetchCustomers();
      setIsModalOpen(false);

    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setGeneralError(
          err.response?.data?.message ||
            "Something went wrong while saving customer."
        );
      }
    }
  };

  // Text Inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: null,
    }));

    setGeneralError("");
  };

  // File Inputs
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: null,
    }));

    setGeneralError("");
  };

  // Table Custom Actions
  const customActions = (row) => (
    <button
      onClick={() => handleView(row)}
      className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
    >
      <Eye className="w-4 h-4" />
    </button>
  );

  // Confirm Delete
  const confirmDelete = async () => {
    if (!selectedCustomer) return;

    try {
      await customerApi.delete(selectedCustomer.id);

      await fetchCustomers();

      setIsDeleteOpen(false);
      setSelectedCustomer(null);

    } catch (err) {
      console.error(
        "Failed to delete customer!",
        err
      );

      alert(
        "Could not delete customer. They might be linked to an active rental."
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-[#111317] p-2 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <PageHeader
          title={t("customer.title")}
          onAdd={handleAdd}
          addLabel={t("customer.addCustomer")}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <Table
        columns={columns}
        data={customers.filter(
          (c) =>
            c.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery)
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
        customActions={customActions}
        isLoading={isLoading}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedCustomer
            ? t("customer.editCustomer")
            : t("customer.addCustomer")
        }
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

          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-6">

            <FormGroup cols={2}>

              {/* Name */}
              <div>
                <FormInput
                  label={t("customer.customerName")}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Legal Name"
                />

                {errors.name && (
                  <div className="mt-2 space-y-1">
                    {errors.name.map((err, index) => (
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

              {/* Phone */}
              <div>
                <FormInput
                  label={t("common.phone")}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+93..."
                />

                {errors.phone && (
                  <div className="mt-2 space-y-1">
                    {errors.phone.map((err, index) => (
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

            {/* Files */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Tazkira */}
              <div>
                <FormFileUpload
                  label={t("customer.tazkiraPhoto")}
                  name="tazkiraPhoto"
                  onChange={handleFileChange}
                  accept="image/*"
                />

                {errors.tazkira_photo && (
                  <div className="mt-2 space-y-1">
                    {errors.tazkira_photo.map(
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

              {/* Photo */}
              <div>
                <FormFileUpload
                  label={t("customer.photo")}
                  name="photo"
                  onChange={handleFileChange}
                  accept="image/*"
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

              {/* License */}
              <div>
                <FormFileUpload
                  label={t("customer.drivingLicense")}
                  name="drivingLicense"
                  onChange={handleFileChange}
                  accept="image/*"
                />

                {errors.driving_license_photo && (
                  <div className="mt-2 space-y-1">
                    {errors.driving_license_photo.map(
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
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 text-xs font-black uppercase text-slate-500 hover:text-white transition-colors"
            >
              {t("common.cancel")}
            </button>

            <button
              type="submit"
              className="px-10 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
            >
              {t("common.save")}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Customer Identity Dossier"
        size="md"
      >
        <div className="space-y-6 overflow-hidden">

          <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden">

            <div className="absolute -right-4 -top-4 text-white/5 transform rotate-12">
              <User size={120} />
            </div>

            <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/20 p-1">
              <img
                src={
                  selectedCustomer?.photo
                    ? `http://localhost:8000/storage/${selectedCustomer?.photo}`
                    : "https://via.placeholder.com/150"
                }

                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/150")
                }

                className="w-full h-full object-cover rounded-xl"

                alt={selectedCustomer?.name}
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white tracking-tighter">
                {selectedCustomer?.name}
              </h3>

              <p className="text-emerald-500 font-mono text-sm tracking-widest">
                {selectedCustomer?.phone}
              </p>

              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded uppercase font-black">
                  Verified Client
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* Tazkira */}
            <div className="p-4 bg-[#090a0c] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3 text-slate-500">
                <FileText size={14} />

                <span className="text-[10px] font-black uppercase tracking-widest">
                  {t("customer.tazkiraPhoto")}
                </span>
              </div>

              <div className="aspect-video bg-white/5 rounded-lg border border-white/10 overflow-hidden">

                {selectedCustomer?.tazkiraPhoto ? (
                  <img
                    src={`http://localhost:8000/storage/${selectedCustomer.tazkiraPhoto}`}
                    className="w-full h-full object-contain cursor-zoom-in"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-700 uppercase">
                    Document Missing
                  </div>
                )}
              </div>
            </div>

            {/* License */}
            <div className="p-4 bg-[#090a0c] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3 text-slate-500">
                <FileText size={14} />

                <span className="text-[10px] font-black uppercase tracking-widest">
                  {t("customer.drivingLicense")}
                </span>
              </div>

              <div className="aspect-video bg-white/5 rounded-lg border border-white/10 overflow-hidden">

                {selectedCustomer?.drivingLicense ? (
                  <img
                    src={`http://localhost:8000/storage/${selectedCustomer.drivingLicense}`}
                    className="w-full h-full object-contain cursor-zoom-in"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-700 uppercase">
                    License Missing
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsViewOpen(false)}
            className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-[.3em] transition-all border border-white/5"
          >
            Close Dossier
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={t("common.delete")}
        message={`Remove ${selectedCustomer?.name} from database? Document history will be lost.`}
      />
    </motion.div>
  );
}