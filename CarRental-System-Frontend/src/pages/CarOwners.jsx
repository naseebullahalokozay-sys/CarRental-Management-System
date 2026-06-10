import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import Table from '../components/Table'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import { FormInput, FormTextarea, Button, FormGroup } from '../components/Form'
import { ownerApi } from '../services/api'
import { motion } from 'framer-motion'
import { UserCheck, MapPin, PhoneCall } from 'lucide-react'

export default function CarOwners() {
  const { t } = useLanguage()

  const [owners, setOwners] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  })

  // Validation Errors
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')

  // Custom rendering for columns to add icons and Emerald flair
  const columns = [
    {
      key: 'name',
      label: t('common.name'),
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <UserCheck size={14} />
          </div>

          <span className="font-bold text-white tracking-tight">
            {val}
          </span>
        </div>
      )
    },

    {
      key: 'phone',
      label: t('common.phone'),
      isNumeric: true,
      render: (val) => (
        <div className="flex items-center gap-2 text-slate-400 group-hover:text-emerald-400 transition-colors">
          <PhoneCall size={12} />

          <span className="font-mono">{val}</span>
        </div>
      )
    },

    {
      key: 'address',
      label: t('common.address'),
      render: (val) => (
        <div className="flex items-center gap-2 text-slate-500 italic max-w-[250px] truncate">
          <MapPin size={12} className="flex-shrink-0" />

          <span>{val}</span>
        </div>
      )
    },
  ]

  useEffect(() => {
    fetchOwners()
  }, [])

  const fetchOwners = async () => {
    setIsLoading(true)

    try {
      const res = await ownerApi.getAll()
      const data = res.data?.data || res.data || []

      setOwners(data)

    } catch (err) {
      console.error("Failed to fetch owners!", err)

    } finally {
      setIsLoading(false)
    }
  }

  const filteredOwners = owners.filter(owner =>
    owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.phone.includes(searchQuery)
  )

  const handleAdd = () => {
    setSelectedOwner(null)

    setFormData({
      name: '',
      phone: '',
      address: ''
    })

    setErrors({})
    setGeneralError('')
    setIsModalOpen(true)
  }

  const handleEdit = (owner) => {
    setSelectedOwner(owner)

    setFormData({
      name: owner.name,
      phone: owner.phone,
      address: owner.address
    })

    setErrors({})
    setGeneralError('')
    setIsModalOpen(true)
  }

  const handleDelete = (owner) => {
    setSelectedOwner(owner)
    setIsDeleteOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrors({})
    setGeneralError('')

    try {
      if (selectedOwner) {
        await ownerApi.update(selectedOwner.id, formData)
      } else {
        await ownerApi.create(formData)
      }

      fetchOwners()
      setIsModalOpen(false)
      setSelectedOwner(null)

    } catch (err) {
      console.error("Failed to submit form!", err)

      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        setGeneralError(
          err.response?.data?.message ||
          "Something went wrong while saving owner."
        )
      }
    }
  }

  const confirmDelete = async () => {
    try {
      await ownerApi.delete(selectedOwner.id)

      fetchOwners()

      setIsDeleteOpen(false)
      setSelectedOwner(null)

    } catch (err) {
      console.error("Failed to delete owner!", err)
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Search and Action Bar */}
      <div className="bg-[#111317] p-2 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <PageHeader
          title={t('owner.title')}
          onAdd={handleAdd}
          addLabel={t('owner.addOwner')}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Main Data View */}
      <div className="relative group">
        {/* Decorative corner glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

        <Table
          columns={columns}
          data={filteredOwners}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedOwner
            ? t('owner.editOwner')
            : t('owner.addOwner')
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6 p-2">

          {/* General Error */}
          {generalError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-2xl px-4 py-3">
              {generalError}
            </div>
          )}

          <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-6">

            <FormGroup cols={2}>
              <div>
                <FormInput
                  label={t('owner.ownerName')}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
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

              <div>
                <FormInput
                  label={t('owner.ownerPhone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+93..."
                  required
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

            <div>
              <FormTextarea
                label={t('owner.ownerAddress')}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Residential or Office address"
                required
              />

              {errors.address && (
                <div className="mt-2 space-y-1">
                  {errors.address.map((err, index) => (
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

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
              {t('common.cancel')}
            </button>

            <button
              type="submit"
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#090a0c] rounded-xl text-xs font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
            >
              {selectedOwner
                ? "Update Registry"
                : "Enroll Owner"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={t('common.delete')}
        message={`Are you sure you want to delete ${selectedOwner?.name}? This action cannot be undone.`}
      />
    </motion.div>
  )
}