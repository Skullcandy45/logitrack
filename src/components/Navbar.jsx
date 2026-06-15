// src/components/Navbar.jsx
import { Link, NavLink } from 'react-router-dom'
import { Package, Plus, LayoutDashboard, Truck } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 h-16">
      <div className="w-full max-w-[1400px] mx-auto px-10 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="bg-blue-600 text-white rounded-xl p-2 flex items-center justify-center">
            <Package size={18} />
          </span>
          <span className="font-bold text-xl text-blue-600 tracking-tight">LogiTrack</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <LayoutDashboard size={15} />
            Dashboard
          </NavLink>
          <NavLink
            to="/shipments"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <Truck size={15} />
            Shipments
          </NavLink>
        </div>

        {/* Add Shipment Button */}
        <Link
          to="/add"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}
        >
          <Plus size={16} />
          Add Shipment
        </Link>
      </div>
    </nav>
  )
}
