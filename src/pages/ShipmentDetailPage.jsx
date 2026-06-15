// src/pages/ShipmentDetailPage.jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Trash2,
  Package,
  Pencil,
} from 'lucide-react'
import {
  selectShipmentById,
  updateShipmentStatus,
  deleteShipment,
} from '../features/shipments/shipmentsSlice'
import TrackingTimeline from '../components/TrackingTimeline'
import StatusBadge from '../components/StatusBadge'
import { formatDate, getStatusLabel, getNextStatuses } from '../utils/helpers'

export default function ShipmentDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const shipment = useSelector(selectShipmentById(id))

  const [selectedStatus, setSelectedStatus] = useState('')
  const [note, setNote] = useState('')
  const [updated, setUpdated] = useState(false)

  if (!shipment) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-10 py-8">
        <button
          onClick={() => navigate('/shipments')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-8 font-medium"
        >
          <ArrowLeft size={16} /> Back to Shipments
        </button>
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Package size={56} strokeWidth={1.2} />
          <p className="mt-4 text-lg font-semibold text-slate-600">Shipment not found</p>
          <p className="text-sm mt-1">The shipment ID does not exist</p>
        </div>
      </div>
    )
  }

  const nextStatuses = getNextStatuses(shipment.status)

  const handleUpdateStatus = () => {
    if (!selectedStatus) return
    dispatch(updateShipmentStatus({ id: shipment.id, newStatus: selectedStatus, note }))
    setSelectedStatus('')
    setNote('')
    setUpdated(true)
    setTimeout(() => setUpdated(false), 3000)
  }

  const handleDelete = () => {
    if (window.confirm(`Delete shipment ${shipment.trackingNumber}? This cannot be undone.`)) {
      dispatch(deleteShipment(shipment.id))
      navigate('/shipments')
    }
  }

  const priorityColors = {
    overnight: 'text-red-600 bg-red-50',
    express: 'text-amber-600 bg-amber-50',
    standard: 'text-slate-600 bg-slate-100',
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-10 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/shipments')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Shipments
      </button>

      {/* Title */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Shipment Detail</h1>
          <p className="text-slate-500 mt-1 font-mono text-sm">{shipment.trackingNumber}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={shipment.status} />
          <button
            onClick={() => navigate(`/shipments/${shipment.id}/edit`)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold transition-colors"
          >
            <Pencil size={15} />
            Edit
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Timeline */}
        <div className="lg:col-span-3">
          <div
            className="bg-white rounded-2xl border border-slate-100 p-6"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
          >
            <h2 className="text-base font-bold text-slate-800 mb-6">Tracking Timeline</h2>
            <TrackingTimeline timeline={shipment.timeline} currentStatus={shipment.status} />
          </div>
        </div>

        {/* Right: Info + Actions */}
        <div className="lg:col-span-2 space-y-5">
          {/* Shipment Info */}
          <div
            className="bg-white rounded-2xl border border-slate-100 p-6"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
          >
            <h2 className="text-base font-bold text-slate-800 mb-5">Shipment Info</h2>
            <div className="space-y-4">
              {/* Tracking */}
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                  Tracking Number
                </p>
                <p className="font-mono text-sm font-bold text-blue-600">
                  {shipment.trackingNumber}
                </p>
              </div>

              {/* Sender → Receiver */}
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  Route
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <div>
                    <p className="font-semibold text-slate-800">{shipment.senderName}</p>
                    <p className="text-xs text-slate-500">{shipment.senderCity}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">{shipment.receiverName}</p>
                    <p className="text-xs text-slate-500">{shipment.receiverCity}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">{shipment.receiverAddress}</p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Carrier
                  </p>
                  <p className="text-sm font-semibold text-slate-700">{shipment.carrier}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Weight
                  </p>
                  <p className="text-sm font-semibold text-slate-700">{shipment.weight || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Priority
                  </p>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                      priorityColors[shipment.priority] || 'text-slate-600 bg-slate-100'
                    }`}
                  >
                    {shipment.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Created
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {formatDate(shipment.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Est. Delivery
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {formatDate(shipment.estimatedDelivery)}
                  </p>
                </div>
                {shipment.deliveredAt && (
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                      Delivered At
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      {formatDate(shipment.deliveredAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Update Status */}
          {nextStatuses.length > 0 && (
            <div
              className="bg-white rounded-2xl border border-slate-100 p-6"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <h2 className="text-base font-bold text-slate-800 mb-4">Update Status</h2>

              {updated && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-2.5 mb-4 font-medium">
                  Status updated successfully!
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    New Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select next status...</option>
                    {nextStatuses.map((s) => (
                      <option key={s} value={s}>
                        {getStatusLabel(s)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Note{' '}
                    <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note for this status update..."
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  />
                </div>
                <button
                  onClick={handleUpdateStatus}
                  disabled={!selectedStatus}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  <RefreshCw size={15} />
                  Update Status
                </button>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div
            className="bg-white rounded-2xl border border-red-100 p-6"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
          >
            <h2 className="text-base font-bold text-red-600 mb-3">Danger Zone</h2>
            <p className="text-sm text-slate-500 mb-4">
              Once deleted, this shipment cannot be recovered.
            </p>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition-colors"
            >
              <Trash2 size={15} />
              Delete Shipment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
