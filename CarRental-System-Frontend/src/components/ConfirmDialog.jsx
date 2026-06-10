import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import { Button } from './Form'
import { useLanguage } from '../context/LanguageContext'

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  variant = 'danger',
}) {
  const { t } = useLanguage()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmLabel || t('common.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
