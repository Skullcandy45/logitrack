// src/components/StatusBadge.jsx
import { getStatusLabel } from '../utils/helpers'

const badgeStyles = {
  pending: 'bg-slate-100 text-slate-600',
  picked_up: 'bg-blue-50 text-blue-600',
  in_transit: 'bg-amber-50 text-amber-600',
  out_for_delivery: 'bg-orange-50 text-orange-600',
  delivered: 'bg-green-50 text-green-700',
  failed: 'bg-red-50 text-red-600',
  returned: 'bg-purple-50 text-purple-600',
}

export default function StatusBadge({ status }) {
  const style = badgeStyles[status] || 'bg-slate-100 text-slate-600'
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${style}`}>
      {getStatusLabel(status)}
    </span>
  )
}
