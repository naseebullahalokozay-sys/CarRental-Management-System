import { useState, useEffect, useRef } from "react";
import { carApi, ownerApi, statusApi, api } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import Table from "../components/Table";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import { FormInput, FormSelect, Button, FormGroup } from "../components/Form";
import PageHeader from "../components/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  CreditCard,
  User,
  Image as ImageIcon,
  Camera,
} from "lucide-react";

export default function Cars() {
  const { t } = useLanguage();

  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [owners, setOwners] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const [formData, setFormData] = useState({
    model: "",
    plateNumber: "",
    image: null,
    ratePerHour: "",
    ratePerDay: "",
    status: "available",
    ownerId: "",
  });

  // Validation Errors
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    fetchCars();
    fetchOwners();
    fetchStatuses();
  }, []);

  const fetchCars = async () => {
    setIsLoading(true);

    try {
      const res = await carApi.getAll();

      const carsData =
        res.data?.data || res.data?.cars || res.data || [];

      setCars(
        Array.isArray(carsData)
          ? carsData.map((car) => ({
              id: car.id,
              model: car.model,
              plateNumber: car.plate_number,
              image: car.image
                ? `http://localhost:8000/storage/${car.image}`
                : null,
              ratePerHour: car.rate_per_hour,
              ratePerDay: car.rate_per_day,
              status: car.status,
              ownerName: car.owner?.name || "",
              ownerId: car.owner_id,
            }))
          : []
      );

    } catch (error) {
      console.error("Error loading cars:", error);

    } finally {
      setIsLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await ownerApi.getAll();

      const data =
        res.data?.data || res.data?.owners || res.data || [];

      setOwners(data);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await statusApi.getAll();

      setStatusOptions(res.data?.data || res.data || []);

    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      key: "image",
      label: t("image"),
      render: (val) => (
        <div className="relative w-16 h-10 group/img overflow-hidden rounded-lg border border-white/10 bg-white/5">
          <img
            src={val || "https://via.placeholder.com/150"}
            alt="Car"
            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-125"
          />

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={12} className="text-white" />
          </div>
        </div>
      ),
    },

    {
      key: "model",
      label: t("car.model"),
      render: (val) => (
        <div className="flex flex-col">
          <span className="text-white font-bold tracking-tight">
            {val}
          </span>

          <span className="text-[10px] text-emerald-500/50 uppercase font-black">
            Fleet Asset
          </span>
        </div>
      ),
    },

    {
      key: "plateNumber",
      label: t("car.plateNumber"),
      render: (val) => (
        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] font-mono text-slate-300 uppercase tracking-widest">
          {val}
        </span>
      ),
    },

    {
      key: "ratePerDay",
      label: t("car.ratePerDay"),
      isNumeric: true,
      render: (val) => (
        <div className="flex items-baseline gap-1">
          <span className="text-emerald-400 font-mono font-bold">
            {val}
          </span>

          <span className="text-[9px] text-slate-500 font-bold uppercase">
            AFG
          </span>
        </div>
      ),
    },

    {
      key: "ownerName",
      label: t("car.owner"),
      render: (val) => (
        <div className="flex items-center gap-2 text-slate-400">
          <User size={12} className="text-emerald-500/50" />

          <span className="text-sm">{val}</span>
        </div>
      ),
    },

    {
      key: "status",
      label: t("common.status"),
      render: (val) => (
        <StatusBadge
          status={val}
          label={t(`car.${val}`)}
        />
      ),
    },
  ];

  const filteredCars = cars.filter(
    (car) =>
      car.model
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      car.plateNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedCar(null);

    setFormData({
      model: "",
      plateNumber: "",
      image: "",
      ratePerHour: "",
      ratePerDay: "",
      status: "available",
      ownerId: "",
    });

    setErrors({});
    setGeneralError("");
    setIsModalOpen(true);
  };

  const handleEdit = (car) => {
    setSelectedCar(car);

    setFormData({
      model: car.model,
      plateNumber: car.plateNumber,
      image: null,
      ratePerHour: car.ratePerHour,
      ratePerDay: car.ratePerDay,
      status: car.status,
      ownerId: car.ownerId,
    });

    setErrors({});
    setGeneralError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setGeneralError("");

    const data = new FormData();

    data.append("model", formData.model);
    data.append("plate_number", formData.plateNumber);
    data.append("rate_per_hour", formData.ratePerHour);
    data.append("rate_per_day", formData.ratePerDay);
    data.append("status", formData.status);
    data.append("owner_id", formData.ownerId);

    // File Upload
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    try {
      if (selectedCar) {
        data.append("_method", "PUT");

        await api.post(`/cars/${selectedCar.id}`, data);

      } else {
        await carApi.create(data);
      }

      fetchCars();
      setIsModalOpen(false);

    } catch (err) {
      console.error(
        "Failed to update car!",
        err.response?.data
      );

      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setGeneralError(
          err.response?.data?.message ||
          "Something went wrong while saving car."
        );
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear field validation errors
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));

    setGeneralError("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-[#111317] p-2 rounded-[2.5rem] border border-white/5">
        <PageHeader
          title={t("car.title")}
          onAdd={handleAdd}
          addLabel={t("car.addCar")}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <Table
        columns={columns}
        data={filteredCars}
        onEdit={handleEdit}
        onDelete={(car) => {
          setSelectedCar(car);
          setIsDeleteOpen(true);
        }}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedCar
            ? t("car.editCar")
            : t("car.addCar")
        }
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* General Error */}
          {generalError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-2xl px-4 py-3">
              {generalError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Image Upload Preview */}
            <div className="lg:col-span-1">
              <div className="relative group aspect-square rounded-3xl overflow-hidden bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center transition-all hover:border-emerald-500/50">

                {formData.image || selectedCar?.image ? (
                  <img
                    src={
                      formData.image
                        ? URL.createObjectURL(formData.image)
                        : selectedCar.image
                    }
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />

                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                      Select Car Photo
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {errors.image && (
                <div className="mt-2 space-y-1">
                  {errors.image.map((err, index) => (
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

            {/* Right: Form Fields */}
            <div className="lg:col-span-2 space-y-4">

              <FormGroup cols={2}>
                <div>
                  <FormInput
                    label={t("car.model")}
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Toyota Camry"
                  />

                  {errors.model && (
                    <div className="mt-2 space-y-1">
                      {errors.model.map((err, index) => (
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

                <div>
                  <FormInput
                    label={t("car.plateNumber")}
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleChange}
                    required
                    placeholder="KBL-12345"
                  />

                  {errors.plate_number && (
                    <div className="mt-2 space-y-1">
                      {errors.plate_number.map((err, index) => (
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

              <FormGroup cols={2}>
                <div>
                  <FormInput
                    label={t("car.ratePerHour")}
                    name="ratePerHour"
                    type="number"
                    value={formData.ratePerHour}
                    onChange={handleChange}
                    required
                  />

                  {errors.rate_per_hour && (
                    <div className="mt-2 space-y-1">
                      {errors.rate_per_hour.map((err, index) => (
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

                <div>
                  <FormInput
                    label={t("car.ratePerDay")}
                    name="ratePerDay"
                    type="number"
                    value={formData.ratePerDay}
                    onChange={handleChange}
                    required
                  />

                  {errors.rate_per_day && (
                    <div className="mt-2 space-y-1">
                      {errors.rate_per_day.map((err, index) => (
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

              <FormGroup cols={2}>
                <div>
                  <FormSelect
                    label={t("car.owner")}
                    name="ownerId"
                    value={formData.ownerId}
                    onChange={handleChange}
                    options={owners.map((o) => ({
                      value: o.id,
                      label: o.name,
                    }))}
                    required
                  />

                  {errors.owner_id && (
                    <div className="mt-2 space-y-1">
                      {errors.owner_id.map((err, index) => (
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

                <div>
                  <FormSelect
                    label={t("common.status")}
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={statusOptions}
                    required
                  />

                  {errors.status && (
                    <div className="mt-2 space-y-1">
                      {errors.status.map((err, index) => (
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
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/5 pt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 text-xs font-black uppercase text-slate-500 hover:text-white transition-colors"
            >
              {t("common.cancel")}
            </button>

            <button
              type="submit"
              className="px-10 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
            >
              {selectedCar
                ? "Update Vehicle"
                : "Add Vehicle"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          await carApi.delete(selectedCar.id);

          fetchCars();
          setIsDeleteOpen(false);
        }}
        title={t("common.delete")}
        message={`Remove ${selectedCar?.model} from fleet? This is permanent.`}
      />
    </motion.div>
  );
}