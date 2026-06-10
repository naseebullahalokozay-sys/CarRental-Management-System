const statusStyles = {
  // Car status
  available: 'bg-green-100 text-green-700',
  unavailable: 'bg-gray-100 text-gray-700',
  rented: 'bg-blue-100 text-blue-700',
  
  // Booking status
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  
  // Guarantee status
  locked: 'bg-orange-100 text-orange-700',
  released: 'bg-green-100 text-green-700',
  
  // Default
  default: 'bg-gray-100 text-gray-700',
}

export default function StatusBadge({ status, label }) {
  const style = statusStyles[status?.toLowerCase()] || statusStyles.default

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
      {label || status}
    </span>
  )
}
