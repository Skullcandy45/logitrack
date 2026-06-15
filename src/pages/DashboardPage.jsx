// src/pages/DashboardPage.jsx
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Package,
  PackageCheck,
  Truck,
  Clock,
  PackageX,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import {
  selectDashboardStats,
  selectAllShipments,
} from '../features/shipments/shipmentsSlice'
import StatCard from '../components/StatCard'
import ShipmentRow from '../components/ShipmentRow'

const STATUS_CONFIG = [
  { key: 'delivered', label: 'Delivered', color: '#10B981' },
  { key: 'in_transit', label: 'In Transit', color: '#F59E0B' },
  { key: 'out_for_delivery', label: 'Out for Delivery', color: '#F97316' },
  { key: 'pending', label: 'Pending', color: '#94A3B8' },
  { key: 'failed', label: 'Failed', color: '#EF4444' },
  { key: 'returned', label: 'Returned', color: '#A855F7' },
]

export default function DashboardPage() {
  const stats = useSelector(selectDashboardStats)
  const allShipments = useSelector(selectAllShipments)

  const recentShipments = [...allShipments].slice(0, 5)

  const rateNumber = parseInt(stats.deliveryRate)

  // Carrier performance
  const carrierCounts = allShipments.reduce((acc, s) => {
    acc[s.carrier] = (acc[s.carrier] || 0) + 1
    return acc
  }, {})
  const carrierEntries = Object.entries(carrierCounts).sort((a, b) => b[1] - a[1])
  const maxCarrier = carrierEntries[0]?.[1] || 1

  // Status breakdown
  const statusCounts = allShipments.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="w-full max-w-[1400px] mx-auto px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your shipment operations</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <StatCard
          title="Total Shipments"
          value={stats.total}
          icon={Package}
          color="blue"
          trend={5}
          trendLabel="vs last month"
        />
        <StatCard
          title="Delivered"
          value={stats.delivered}
          icon={PackageCheck}
          color="green"
          trend={8}
          trendLabel="on time"
        />
        <StatCard
          title="In Transit"
          value={stats.inTransit}
          icon={Truck}
          color="amber"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="slate"
        />
        <StatCard
          title="Failed"
          value={stats.failed}
          icon={PackageX}
          color="red"
          trend={-2}
          trendLabel="improvement"
        />
      </div>

      {/* Delivery Rate + Status Breakdown + Carrier Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Delivery Rate */}
        <div
          className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center justify-center"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-6 self-start">
            <TrendingUp size={16} className="text-green-500" />
            <h2 className="text-base font-bold text-slate-800">Delivery Rate</h2>
          </div>
          {/* Circular progress */}
          <div className="flex flex-col items-center justify-center">
            <div
              className="w-36 h-36 rounded-full relative flex items-center justify-center"
              style={{
                background: `conic-gradient(#10B981 ${rateNumber * 3.6}deg, #F1F5F9 0deg)`,
              }}
            >
              <div className="w-24 h-24 absolute bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-800">{stats.deliveryRate}</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-4 text-center">Delivery Success Rate</p>
            <p className="text-xs text-slate-400 mt-1">
              {stats.delivered} of {stats.total} shipments
            </p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div
          className="bg-white rounded-2xl border border-slate-100 p-6"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <h2 className="text-base font-bold text-slate-800 mb-5">Status Breakdown</h2>
          <div className="space-y-3">
            {STATUS_CONFIG.map(({ key, label, color }) => {
              const count = statusCounts[key] || 0
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600 font-medium">{label}</span>
                    <span className="text-sm font-bold text-slate-800">{count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Carrier Performance */}
        <div
          className="bg-white rounded-2xl border border-slate-100 p-6"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <h2 className="text-base font-bold text-slate-800 mb-5">Carrier Performance</h2>
          <div className="space-y-3">
            {carrierEntries.map(([carrier, count]) => (
              <div key={carrier}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-600 font-medium">{carrier}</span>
                  <span className="text-sm font-bold text-slate-800">{count} shipments</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-400 transition-all"
                    style={{ width: `${(count / maxCarrier) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Shipments */}
      <div
        className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Recent Shipments</h2>
          <Link
            to="/shipments"
            className="flex items-center gap-1 text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tracking No
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Receiver
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Carrier
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Est. Delivery
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentShipments.map((s) => (
                <ShipmentRow key={s.id} shipment={s} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
