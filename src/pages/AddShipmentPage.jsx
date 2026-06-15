// src/pages/AddShipmentPage.jsx
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { addShipment } from '../features/shipments/shipmentsSlice'
import ShipmentForm from '../components/ShipmentForm'

export default function AddShipmentPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (shipmentData) => {
    dispatch(addShipment(shipmentData))
    navigate('/shipments')
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

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Add New Shipment</h1>
        <p className="text-slate-500 mt-1">Fill in the details to create a new shipment</p>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl">
        <div
          className="bg-white rounded-2xl border border-slate-100 p-8"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <ShipmentForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
