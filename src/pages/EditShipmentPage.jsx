// src/pages/EditShipmentPage.jsx
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Package } from 'lucide-react'
import { editShipment, selectShipmentById } from '../features/shipments/shipmentsSlice'
import ShipmentForm from '../components/ShipmentForm'

export default function EditShipmentPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const shipment = useSelector(selectShipmentById(id))

  const handleSubmit = (formData) => {
    dispatch(editShipment({ id, changes: formData }))
    navigate(`/shipments/${id}`)
  }

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

  return (
    <div className="w-full max-w-[1400px] mx-auto px-10 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(`/shipments/${id}`)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Shipment Details
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Edit Shipment</h1>
        <p className="text-slate-500 mt-1">Update fields for shipment <span className="font-mono">{shipment.trackingNumber}</span></p>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl">
        <div
          className="bg-white rounded-2xl border border-slate-100 p-8"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <ShipmentForm
            onSubmit={handleSubmit}
            initialData={shipment}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </div>
  )
}
