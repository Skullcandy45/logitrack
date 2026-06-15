// src/pages/ShipmentsPage.jsx
import { useSelector, useDispatch } from 'react-redux'
import { Search, X, ChevronUp, ChevronDown, PackageX } from 'lucide-react'
import {
  selectFilteredShipments,
  selectPaginatedShipments,
  selectTotalPages,
  selectFilters,
  selectSort,
  selectCurrentPage,
  setFilter,
  clearFilters,
  setSort,
  setPage,
} from '../features/shipments/shipmentsSlice'
import ShipmentRow from '../components/ShipmentRow'
import Pagination from '../components/Pagination'

const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
  { value: 'returned', label: 'Returned' },
]

const CARRIERS = ['', 'BlueDart', 'DTDC', 'Delhivery', 'Ekart', 'FedEx', 'Shadowfax']

const SORTABLE_COLUMNS = [
  { field: 'trackingNumber', label: 'Tracking No' },
  { field: 'receiverName', label: 'Receiver' },
  { field: 'carrier', label: 'Carrier' },
  { field: 'status', label: 'Status' },
  { field: 'createdAt', label: 'Created' },
  { field: 'estimatedDelivery', label: 'Est. Delivery' },
]

export default function ShipmentsPage() {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const sort = useSelector(selectSort)
  const currentPage = useSelector(selectCurrentPage)
  const totalPages = useSelector(selectTotalPages)
  const paginated = useSelector(selectPaginatedShipments)
  const filtered = useSelector(selectFilteredShipments)

  const handleSort = (field) => {
    if (sort.field === field) {
      dispatch(setSort({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' }))
    } else {
      dispatch(setSort({ field, direction: 'asc' }))
    }
  }

  const SortIcon = ({ field }) => {
    if (sort.field !== field) return <ChevronDown size={13} className="text-slate-300" />
    return sort.direction === 'asc' ? (
      <ChevronUp size={13} className="text-blue-500" />
    ) : (
      <ChevronDown size={13} className="text-blue-500" />
    )
  }

  const hasActiveFilters =
    filters.search || filters.status || filters.carrier || filters.dateFrom || filters.dateTo

  return (
    <div className="w-full max-w-[1400px] mx-auto px-10 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">All Shipments</h1>
        <p className="text-slate-500 mt-1">Manage and track all your shipments</p>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-2xl border border-slate-100 p-4 mb-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
      >
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by tracking no. or receiver..."
              value={filters.search}
              onChange={(e) => dispatch(setFilter({ key: 'search', value: e.target.value }))}
              className="border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => dispatch(setFilter({ key: 'status', value: e.target.value }))}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-w-[140px]"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Carrier */}
          <select
            value={filters.carrier}
            onChange={(e) => dispatch(setFilter({ key: 'carrier', value: e.target.value }))}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-w-[130px]"
          >
            {CARRIERS.map((c) => (
              <option key={c} value={c}>
                {c || 'All Carriers'}
              </option>
            ))}
          </select>

          {/* Date From */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">From</span>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => dispatch(setFilter({ key: 'dateFrom', value: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Date To */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">To</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => dispatch(setFilter({ key: 'dateTo', value: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={() => dispatch(clearFilters())}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500 mb-4 font-medium">
        Showing <span className="text-slate-800 font-bold">{filtered.length}</span> shipments
        {hasActiveFilters && ' (filtered)'}
      </p>

      {/* Table */}
      <div
        className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
      >
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <PackageX size={48} strokeWidth={1.2} />
            <p className="mt-4 text-base font-semibold text-slate-500">No shipments found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  {SORTABLE_COLUMNS.map(({ field, label }) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field)}
                      className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-800 select-none"
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        <SortIcon field={field} />
                      </div>
                    </th>
                  ))}
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((s) => (
                  <ShipmentRow key={s.id} shipment={s} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => dispatch(setPage(p))}
      />
    </div>
  )
}
