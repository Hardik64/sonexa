import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, showBack = false, rightSlot }) {
  const navigate = useNavigate()

  return (
    <header
      className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-14"
      style={{
        background: 'rgba(14,14,14,0.85)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-white text-xl">arrow_back</span>
          </button>
        )}
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            graphic_eq
          </span>
          <span className="font-black tracking-tighter text-white text-base">
            {title || 'Sonexa'}
          </span>
        </div>
      </div>
      {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
    </header>
  )
}
