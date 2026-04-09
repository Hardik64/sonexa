import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-in pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border border-white/10 min-w-[280px] max-w-sm"
            style={{
              background: t.type === 'error' ? '#b92902' : 'rgba(26,26,26,0.95)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <span
              className="material-symbols-outlined text-xl flex-shrink-0"
              style={{
                fontVariationSettings: "'FILL' 1",
                color: t.type === 'error' ? '#ffd2c8' : '#72fe8f',
              }}
            >
              {t.type === 'error' ? 'error' : 'check_circle'}
            </span>
            <p className="text-sm font-semibold text-white flex-1">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-white/50 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
