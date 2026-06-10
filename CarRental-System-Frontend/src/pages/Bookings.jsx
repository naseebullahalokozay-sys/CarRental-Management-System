import { useEffect, useState } from 'react'
import { Calendar, Car, User } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import Table from '../components/Table'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/StatusBadge'
import { FormInput, FormSelect, Button, FormGroup } from '../components/Form'
import { bookingApi, customerApi, carApi } from '../services/api'
import { motion } from 'framer-motion'

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
]

export default function Bookings() {
  const { t } = useLanguage()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [customers, setCustomers] = useState([])
  const [cars, setCars] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const [formData, setFormData] = useState({
    customerId: '',
    carId: '',
    bookingDate: '',
    status: 'pending',
  })

  // Validation Errors
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')

  const formatDisplayDate = (date) => {
    if (!date) return "-";
    const cleaned = date.replace(" ", "T").replace("Z:00", "Z");

    return new Date(cleaned).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDate = (date) => (date ? date.slice(0, 10) : '')

  useEffect(() => {
    fetchBookings()
    fetchCustomers()
    fetchCars()
  }, [])

  const fetchBookings = async () => {
    setIsLoading(true)

    try {
      const res = await bookingApi.getAll()

      const data = res.data?.data || res.data || []

      const formatted = data.map(booking => ({
        id: booking.id,
        customerId: booking.customer_id,
        carId: booking.car_id,
        customerName: booking.customer ? booking.customer.name : 'No Customer',
        carName: booking.car ? booking.car.model : 'No Car',
        bookingDate: formatDate(booking?.booking_date) || '',
        status: booking.status?.replace('booking.', ''),
      }))

      setBookings(formatted)
    } catch (err) {
      console.error("Failed to fetch bookings!", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const res = await customerApi.getAll()
      const data = res.data?.data || res.data || []
      setCustomers(data)
    } catch (err) {
      console.error("Failed to fetch customers!", err)
    }
  }

  const fetchCars = async () => {
    try {
      const res = await carApi.getAll()
      const data = res.data?.data || res.data || []
      setCars(data)
    } catch (err) {
      console.error("Failed to fetch cars!", err)
    }
  }

  const columns = [
    {
      key: 'customerName',
      label: t('booking.customer'),
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <User size={14} />
          </div>

          <span className="font-bold text-white tracking-tight">{val}</span>
        </div>
      )
    },

    {
      key: 'carName',
      label: t('booking.car'),
      render: (val) => (
        <div className="flex items-center gap-2 text-slate-300">
          <Car size={14} className="text-emerald-500/50" />

          <span className="text-xs uppercase font-black tracking-widest">
            {val}
          </span>
        </div>
      )
    },

    {
      key: 'bookingDate',
      label: t('booking.bookingDate'),
      render: val => (
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <Calendar size={12} />
          {formatDisplayDate(val)}
        </div>
      )
    },

    {
      key: 'status',
      label: t('common.status'),
      render: (val) => <StatusBadge status={val} />
    }
  ]

  const handleAdd = () => {
    setSelectedBooking(null)

    setFormData({
      customerId: '',
      carId: '',
      bookingDate: '',
      status: 'pending',
    })

    setErrors({})
    setGeneralError('')
    setIsModalOpen(true)
  }

  const handleEdit = (booking) => {
    setSelectedBooking(booking)

    setFormData({
      customerId: booking.customerId || '',
      carId: booking.carId || '',
      bookingDate: booking.bookingDate || '',
      status: booking.status || 'pending',
    })

    setErrors({})
    setGeneralError('')
    setIsModalOpen(true)
  }

  const handleDelete = (booking) => {
    setSelectedBooking(booking)
    setIsDeleteOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrors({})
    setGeneralError('')

    const payload = {
      customer_id: formData.customerId,
      car_id: formData.carId,
      booking_date: formData.bookingDate,
      status: formData.status,
    }

    try {
      if (selectedBooking) {
        await bookingApi.update(selectedBooking.id, payload)
      } else {
        await bookingApi.create(payload)
      }

      fetchBookings()
      setIsModalOpen(false)
      setSelectedBooking(null)

    } catch (err) {
      console.error("Failed to save booking!", err.response?.data)

      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        setGeneralError(
          err.response?.data?.message ||
          "Something went wrong while saving booking."
        )
      }
    }
  }

  const confirmDelete = async () => {
    try {
      await bookingApi.delete(selectedBooking.id)

      setBookings(
        bookings.filter(b => b.id !== selectedBooking.id)
      )

      setIsDeleteOpen(false)
      setSelectedBooking(null)

    } catch (err) {
      console.error("Delete failed", err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

    // Clear field validation error
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: null
    }))

    setGeneralError('')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-[#111317] p-2 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <PageHeader
          title={t('booking.title')}
          onAdd={handleAdd}
          addLabel={t('booking.addBooking')}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <Table
        columns={columns}
        data={bookings.filter(b =>
          b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.carName.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Booking Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedBooking
            ? t('booking.editBooking')
            : t('booking.addBooking')
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

          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-6">

            <FormGroup cols={2}>
              <div>
                <FormSelect
                  label={t('booking.customer')}
                  name="customerId"
                  value={formData.customerId || ''}
                  onChange={handleChange}
                  options={customers.map(c => ({
                    value: c.id,
                    label: c.name
                  }))}
                  required
                />

                {errors.customer_id && (
                  <div className="mt-2 space-y-1">
                    {errors.customer_id.map((err, index) => (
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
                  label={t('booking.car')}
                  name="carId"
                  value={formData.carId || ''}
                  onChange={handleChange}
                  options={cars.map(c => ({
                    value: c.id,
                    label: c.model
                  }))}
                  required
                />

                {errors.car_id && (
                  <div className="mt-2 space-y-1">
                    {errors.car_id.map((err, index) => (
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
                  label={t('booking.bookingDate')}
                  name="bookingDate"
                  type="date"
                  value={formData.bookingDate || ''}
                  onChange={handleChange}
                  required
                />

                {errors.booking_date && (
                  <div className="mt-2 space-y-1">
                    {errors.booking_date.map((err, index) => (
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
                  label={t('common.status')}
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

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 text-xs font-black uppercase text-slate-500 hover:text-white transition-colors"
            >
              {t('common.cancel')}
            </button>

            <button
              type="submit"
              className="px-10 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={t('common.delete')}
        message={`Warning: You are about to remove this booking record. This action cannot be undone.`}
      />
    </motion.div>
  )
}