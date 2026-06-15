// src/components/StatCard.jsx
import { TrendingUp, TrendingDown } from 'lucide-react'

const colorMap = {
  blue: {
    border: 'border-t-4 border-blue-500',
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-600',
    valueText: 'text-blue-600',
  },
  green: {
    border: 'border-t-4 border-green-500',
    iconBg: 'bg-green-50',
    iconText: 'text-green-600',
    valueText: 'text-green-600',
  },
  amber: {
    border: 'border-t-4 border-amber-500',
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-600',
    valueText: 'text-amber-600',
  },
  slate: {
    border: 'border-t-4 border-slate-400',
    iconBg: 'bg-slate-100',
    iconText: 'text-slate-600',
    valueText: 'text-slate-700',
  },
  red: {
    border: 'border-t-4 border-red-500',
    iconBg: 'bg-red-50',
    iconText: 'text-red-600',
    valueText: 'text-red-600',
  },
}

export default function StatCard({ title, value, icon: Icon, color = 'blue', trend, trendLabel }) {
  const c = colorMap[color] || colorMap.blue

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 p-6 min-w-0 ${c.border}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      {/* Icon + Title */}
      <div className="flex items-center justify-between mb-4">
        <div className={`${c.iconBg} ${c.iconText} rounded-xl p-2.5 flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              trend >= 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Value */}
      <p className="text-4xl font-extrabold text-slate-900 mb-1">{value}</p>

      {/* Title */}
      <p className="text-sm text-slate-500 font-medium">{title}</p>

      {/* Trend label */}
      {trendLabel && <p className="text-xs text-slate-400 mt-1">{trendLabel}</p>}
    </div>
  )
}
