import React from 'react'

export default function Spinner({ size = 'md' }) {
  const sz = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'
  return (
    <span className={`material-symbols-outlined text-primary spin ${sz}`}
      style={{ fontSize: size === 'sm' ? 16 : size === 'lg' ? 40 : 24 }}>
      progress_activity
    </span>
  )
}
