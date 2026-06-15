// src/hooks/useUnsavedChanges.js
import { useEffect, useCallback } from 'react'
import { useBlocker } from 'react-router-dom'

export default function useUnsavedChanges(isDirty) {
  // 1. Warn on browser tab close / reload
  useEffect(() => {
    if (!isDirty) return

    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
      return e.returnValue
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty])

  // 2. Warn on in-app navigation (React Router Data Router required)
  const shouldBlock = useCallback(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
    [isDirty]
  )

  const blocker = useBlocker(shouldBlock)

  // Auto-confirm if user somehow triggers proceed after blocker is set
  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      )
      if (confirmed) {
        blocker.proceed()
      } else {
        blocker.reset()
      }
    }
  }, [blocker])
}
