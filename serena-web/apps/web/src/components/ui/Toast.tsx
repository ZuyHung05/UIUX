import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import './Toast.css'

type ToastTone = 'success' | 'info' | 'warning' | 'danger'

type ToastItem = {
  id: number
  message: string
  tone: ToastTone
}

type ToastContextValue = {
  showToast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, message, tone }])
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-label="Thông báo hệ thống">
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return context
}

function ToastMessage({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => onDismiss(toast.id), 3000)

    return () => window.clearTimeout(timeoutId)
  }, [onDismiss, toast.id])

  return (
    <div className={`toast-message toast-message-${toast.tone}`} role="status">
      <span className="toast-message-dot" aria-hidden="true" />
      <span className="toast-message-text">{toast.message}</span>
      <button type="button" aria-label="Tắt thông báo" onClick={() => onDismiss(toast.id)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  )
}
