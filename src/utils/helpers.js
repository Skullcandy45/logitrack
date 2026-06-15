// src/utils/helpers.js

export function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getStatusLabel(status) {
  const map = {
    pending: 'Pending',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    failed: 'Failed',
    returned: 'Returned',
  }
  return map[status] || status
}

export function getCarrierPrefix(carrier) {
  const map = {
    BlueDart: 'BD',
    DTDC: 'DT',
    Delhivery: 'DL',
    Ekart: 'EK',
    FedEx: 'FX',
    Shadowfax: 'SF',
  }
  return map[carrier] || 'XX'
}

export function getDaysAgo(dateString) {
  if (!dateString) return '—'
  const days = Math.floor((Date.now() - new Date(dateString)) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return days + ' days ago'
}

export function getNextStatuses(currentStatus) {
  const flow = {
    pending: ['picked_up'],
    picked_up: ['in_transit'],
    in_transit: ['out_for_delivery'],
    out_for_delivery: ['delivered', 'failed'],
    delivered: ['returned'],
    failed: ['returned'],
    returned: [],
  }
  return flow[currentStatus] || []
}

export function getTodayString() {
  return new Date().toISOString().split('T')[0]
}
