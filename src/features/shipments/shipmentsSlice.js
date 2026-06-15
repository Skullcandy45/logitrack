// src/features/shipments/shipmentsSlice.js
import { createSlice } from '@reduxjs/toolkit'
import shipmentsData from './shipmentsData'

const saved = localStorage.getItem('logitrack_data')
const initialState = saved
  ? JSON.parse(saved)
  : {
      shipments: shipmentsData,
      filters: {
        search: '',
        status: '',
        carrier: '',
        dateFrom: '',
        dateTo: '',
      },
      sort: {
        field: 'createdAt',
        direction: 'desc',
      },
      currentPage: 1,
      itemsPerPage: 8,
      status: 'idle',
      error: null,
    }

const persist = (state) => {
  localStorage.setItem('logitrack_data', JSON.stringify(state))
}

const shipmentsSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    addShipment(state, action) {
      state.shipments.unshift(action.payload)
      state.currentPage = 1
      persist(state)
    },
    editShipment(state, action) {
      const { id, changes } = action.payload
      const shipment = state.shipments.find((s) => s.id === id)
      if (shipment) {
        const editableFields = [
          'receiverName',
          'receiverCity',
          'receiverAddress',
          'senderName',
          'senderCity',
          'carrier',
          'weight',
          'priority',
          'estimatedDelivery',
        ]
        editableFields.forEach((field) => {
          if (changes[field] !== undefined) {
            shipment[field] = changes[field]
          }
        })
      }
      persist(state)
    },
    updateShipmentStatus(state, action) {
      const { id, newStatus, note } = action.payload
      const shipment = state.shipments.find((s) => s.id === id)
      if (shipment) {
        shipment.status = newStatus
        if (newStatus === 'delivered') {
          shipment.deliveredAt = new Date().toISOString().split('T')[0]
        }
        const statusLabels = {
          pending: 'Order Placed',
          picked_up: 'Picked Up',
          in_transit: 'In Transit',
          out_for_delivery: 'Out for Delivery',
          delivered: 'Delivered',
          failed: 'Delivery Failed',
          returned: 'Returned to Sender',
        }
        // Mark the matching timeline step as complete, or push a new entry
        const existingStep = shipment.timeline.find((t) => t.status === newStatus)
        if (existingStep) {
          existingStep.completed = true
          existingStep.timestamp = new Date().toISOString()
          if (note) existingStep.note = note
        } else {
          shipment.timeline.push({
            status: newStatus,
            label: statusLabels[newStatus] || newStatus,
            timestamp: new Date().toISOString(),
            note: note || '',
            completed: true,
          })
        }
      }
      persist(state)
    },
    deleteShipment(state, action) {
      state.shipments = state.shipments.filter((s) => s.id !== action.payload)
      persist(state)
    },
    setFilter(state, action) {
      const { key, value } = action.payload
      state.filters[key] = value
      state.currentPage = 1
      persist(state)
    },
    clearFilters(state) {
      state.filters = {
        search: '',
        status: '',
        carrier: '',
        dateFrom: '',
        dateTo: '',
      }
      state.currentPage = 1
      persist(state)
    },
    setSort(state, action) {
      const { field, direction } = action.payload
      state.sort = { field, direction }
      persist(state)
    },
    setPage(state, action) {
      state.currentPage = action.payload
      persist(state)
    },
  },
})

export const {
  addShipment,
  editShipment,
  updateShipmentStatus,
  deleteShipment,
  setFilter,
  clearFilters,
  setSort,
  setPage,
} = shipmentsSlice.actions

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAllShipments = (state) => state.shipments.shipments

export const selectFilters = (state) => state.shipments.filters

export const selectSort = (state) => state.shipments.sort

export const selectCurrentPage = (state) => state.shipments.currentPage

export const selectItemsPerPage = (state) => state.shipments.itemsPerPage

export const selectFilteredShipments = (state) => {
  const { shipments, filters, sort } = state.shipments
  const { search, status, carrier, dateFrom, dateTo } = filters

  let result = [...shipments]

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (s) =>
        s.trackingNumber.toLowerCase().includes(q) ||
        s.receiverName.toLowerCase().includes(q)
    )
  }
  if (status) {
    result = result.filter((s) => s.status === status)
  }
  if (carrier) {
    result = result.filter((s) => s.carrier === carrier)
  }
  if (dateFrom) {
    result = result.filter((s) => s.createdAt >= dateFrom)
  }
  if (dateTo) {
    result = result.filter((s) => s.createdAt <= dateTo)
  }

  // Sorting
  result.sort((a, b) => {
    let aVal = a[sort.field] || ''
    let bVal = b[sort.field] || ''
    if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1
    if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1
    return 0
  })

  return result
}

export const selectPaginatedShipments = (state) => {
  const filtered = selectFilteredShipments(state)
  const { currentPage, itemsPerPage } = state.shipments
  const start = (currentPage - 1) * itemsPerPage
  return filtered.slice(start, start + itemsPerPage)
}

export const selectTotalPages = (state) => {
  const filtered = selectFilteredShipments(state)
  return Math.ceil(filtered.length / state.shipments.itemsPerPage)
}

export const selectDashboardStats = (state) => {
  const shipments = state.shipments.shipments
  const total = shipments.length
  const delivered = shipments.filter((s) => s.status === 'delivered').length
  const inTransit = shipments.filter((s) => s.status === 'in_transit').length
  const pending = shipments.filter((s) => s.status === 'pending').length
  const failed = shipments.filter((s) => s.status === 'failed').length
  const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) + '%' : '0%'
  return { total, delivered, inTransit, pending, failed, deliveryRate }
}

export const selectShipmentById = (id) => (state) =>
  state.shipments.shipments.find((s) => s.id === id)

export default shipmentsSlice.reducer
