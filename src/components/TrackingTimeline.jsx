// src/components/TrackingTimeline.jsx
import { Check, MapPin, Circle } from 'lucide-react'
import { formatDateTime } from '../utils/helpers'

export default function TrackingTimeline({ timeline, currentStatus }) {
  return (
    <div className="space-y-0">
      {timeline.map((step, index) => {
        const isCompleted = step.completed
        const isCurrent = step.status === currentStatus && step.completed
        const isLast = index === timeline.length - 1

        return (
          <div key={index} className="flex gap-4">
            {/* Left: dot + connector */}
            <div className="flex flex-col items-center">
              {/* Dot */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                  isCompleted && isCurrent
                    ? 'bg-blue-600 text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-white border-2 border-slate-200 text-slate-300'
                } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
              >
                {isCurrent ? (
                  <span className={isCurrent ? 'animate-pulse' : ''}>
                    <MapPin size={14} />
                  </span>
                ) : isCompleted ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : (
                  <Circle size={12} />
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 my-1 ${
                    isCompleted ? 'bg-green-200' : 'bg-slate-100'
                  }`}
                  style={{ minHeight: '32px' }}
                />
              )}
            </div>

            {/* Right: content */}
            <div className={`pb-8 ${isLast ? 'pb-0' : ''} flex-1`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p
                  className={`text-sm font-semibold ${
                    isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
                {step.timestamp && (
                  <span className="text-xs text-slate-400 font-medium">
                    {formatDateTime(step.timestamp)}
                  </span>
                )}
              </div>
              {step.note && (
                <p className={`text-sm mt-0.5 ${isCompleted ? 'text-slate-500' : 'text-slate-300'}`}>
                  {step.note}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
