// src/components/ShipmentRow.jsx
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Eye, Trash2, Zap, Flame, Minus } from 'lucide-react'
import { deleteShipment } from '../features/shipments/shipmentsSlice'
import StatusBadge from './StatusBadge'
import { formatDate } from '../utils/helpers'

const priorityConfig = {
  overnight: {
    dot: 'bg-red-500',
    label: 'Overnight',
    icon: Zap,
    text: 'text-red-600',
  },
  express: {
    dot: 'bg-amber-500',
    label: 'Express',
    icon: Flame,
    text: 'text-amber-600',
  },
  standard: {
    dot: 'bg-slate-400',
    label: 'Standard',
    icon: Minus,
    text: 'text-slate-500',
  },
}

export default function ShipmentRow({ shipment }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const priority = priorityConfig[shipment.priority] || priorityConfig.standard
  const PriorityIcon = priority.icon

  const handleDelete = () => {
    if (window.confirm(`Delete shipment ${shipment.trackingNumber}? This cannot be undone.`)) {
      dispatch(deleteShipment(shipment.id))
    }
  }

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="px-5 py-4">
        <span className="font-mono text-sm font-semibold text-blue-600">
          {shipment.trackingNumber}
        </span>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm font-medium text-slate-800">{shipment.receiverName}</p>
        <p className="text-xs text-slate-400 mt-0.5">{shipment.receiverCity}</p>
      </td>
      <td className="px-5 py-4">
        <span className="text-sm text-slate-600 font-medium">{shipment.carrier}</span>
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={shipment.status} />
      </td>
      <td className="px-5 py-4">
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${priority.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          <PriorityIcon size={11} />
          {priority.label}
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="text-sm text-slate-600">{formatDate(shipment.estimatedDelivery)}</span>
      </td>
      <td className="px-5 py-4">
        <span className="text-sm text-slate-500">{formatDate(shipment.createdAt)}</span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/shipments/${shipment.id}`)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="View Details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete Shipment"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  )
}
