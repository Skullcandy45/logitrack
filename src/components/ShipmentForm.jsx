// src/components/ShipmentForm.jsx
import { useState } from 'react'
import { getCarrierPrefix, getTodayString } from '../utils/helpers'
import useUnsavedChanges from '../hooks/useUnsavedChanges'

const CARRIERS = ['BlueDart', 'DTDC', 'Delhivery', 'Ekart', 'FedEx', 'Shadowfax']
const PRIORITIES = ['standard', 'express', 'overnight']

const emptyForm = {
  receiverName: '',
  receiverCity: '',
  receiverAddress: '',
  senderName: '',
  senderCity: '',
  carrier: 'BlueDart',
  weight: '',
  priority: 'standard',
  estimatedDelivery: '',
}

export default function ShipmentForm({ onSubmit, initialData, submitLabel = 'Create Shipment' }) {
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        receiverName: initialData.receiverName || '',
        receiverCity: initialData.receiverCity || '',
        receiverAddress: initialData.receiverAddress || '',
        senderName: initialData.senderName || '',
        senderCity: initialData.senderCity || '',
        carrier: initialData.carrier || 'BlueDart',
        weight: initialData.weight || '',
        priority: initialData.priority || 'standard',
        estimatedDelivery: initialData.estimatedDelivery || '',
      }
    }
    return emptyForm
  })
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const initialFormState = initialData ? {
    receiverName: initialData.receiverName || '',
    receiverCity: initialData.receiverCity || '',
    receiverAddress: initialData.receiverAddress || '',
    senderName: initialData.senderName || '',
    senderCity: initialData.senderCity || '',
    carrier: initialData.carrier || 'BlueDart',
    weight: initialData.weight || '',
    priority: initialData.priority || 'standard',
    estimatedDelivery: initialData.estimatedDelivery || '',
  } : emptyForm

  const isDirty = !isSubmitted && initialData && JSON.stringify(form) !== JSON.stringify(initialFormState)

  useUnsavedChanges(isDirty)

  const validate = () => {
    const e = {}
    if (!form.receiverName.trim()) e.receiverName = 'Receiver name is required'
    if (!form.receiverCity.trim()) e.receiverCity = 'Receiver city is required'
    if (!form.receiverAddress.trim()) e.receiverAddress = 'Receiver address is required'
    if (!form.senderName.trim()) e.senderName = 'Sender name is required'
    if (!form.senderCity.trim()) e.senderCity = 'Sender city is required'
    if (!form.estimatedDelivery) e.estimatedDelivery = 'Estimated delivery date is required'
    return e
  }

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setIsSubmitted(true)
    if (initialData) {
      onSubmit(form)
    } else {
      const now = new Date().toISOString()
      const today = getTodayString()
      const trackingNumber = getCarrierPrefix(form.carrier) + Date.now()
      const id = 'SHP' + Date.now()

      const shipment = {
        ...form,
        id,
        trackingNumber,
        status: 'pending',
        createdAt: today,
        deliveredAt: null,
        timeline: [
          {
            status: 'pending',
            label: 'Order Placed',
            timestamp: now,
            note: 'Shipment created',
            completed: true,
          },
        ],
      }
      onSubmit(shipment)
    }
  }

  const inputClass = (field) =>
    `border ${
      errors[field] ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-500'
    } rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:ring-2 bg-white text-slate-800 placeholder-slate-400`

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {initialData && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 font-medium">
          Note: Status and tracking timeline cannot be modified here. They must be updated directly from the shipment detail page.
        </div>
      )}
      {/* Receiver Info */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          Receiver Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Receiver Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.receiverName}
              onChange={(e) => handleChange('receiverName', e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className={inputClass('receiverName')}
            />
            {errors.receiverName && (
              <p className="text-xs text-red-500 mt-1">{errors.receiverName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Receiver City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.receiverCity}
              onChange={(e) => handleChange('receiverCity', e.target.value)}
              placeholder="e.g. Mumbai"
              className={inputClass('receiverCity')}
            />
            {errors.receiverCity && (
              <p className="text-xs text-red-500 mt-1">{errors.receiverCity}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Receiver Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={form.receiverAddress}
              onChange={(e) => handleChange('receiverAddress', e.target.value)}
              placeholder="Full delivery address with PIN code"
              className={inputClass('receiverAddress') + ' resize-none'}
            />
            {errors.receiverAddress && (
              <p className="text-xs text-red-500 mt-1">{errors.receiverAddress}</p>
            )}
          </div>
        </div>
      </div>

      {/* Sender Info */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          Sender Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Sender Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.senderName}
              onChange={(e) => handleChange('senderName', e.target.value)}
              placeholder="e.g. TechMart Pvt Ltd"
              className={inputClass('senderName')}
            />
            {errors.senderName && (
              <p className="text-xs text-red-500 mt-1">{errors.senderName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Sender City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.senderCity}
              onChange={(e) => handleChange('senderCity', e.target.value)}
              placeholder="e.g. Delhi"
              className={inputClass('senderCity')}
            />
            {errors.senderCity && (
              <p className="text-xs text-red-500 mt-1">{errors.senderCity}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipment Info */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          Shipment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Carrier</label>
            <select
              value={form.carrier}
              onChange={(e) => handleChange('carrier', e.target.value)}
              className={inputClass('carrier')}
            >
              {CARRIERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Weight</label>
            <input
              type="text"
              value={form.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              placeholder="e.g. 2.5 kg"
              className={inputClass('weight')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Estimated Delivery <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.estimatedDelivery}
              onChange={(e) => handleChange('estimatedDelivery', e.target.value)}
              min={initialData ? undefined : getTodayString()}
              className={inputClass('estimatedDelivery')}
            />
            {errors.estimatedDelivery && (
              <p className="text-xs text-red-500 mt-1">{errors.estimatedDelivery}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleChange('priority', p)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors border ${
                    form.priority === p
                      ? p === 'overnight'
                        ? 'bg-red-50 border-red-400 text-red-600'
                        : p === 'express'
                        ? 'bg-amber-50 border-amber-400 text-amber-600'
                        : 'bg-blue-50 border-blue-400 text-blue-600'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
        style={{ boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}
      >
        {submitLabel}
      </button>
    </form>
  )
}
