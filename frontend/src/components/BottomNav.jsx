import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function BottomNav() {
  const { user } = useAuth()

  const links = [
    { to: '/home', icon: 'home', label: 'Home' },
    { to: '/albums', icon: 'library_music', label: 'Albums' },
    ...(user?.role === 'artist'
      ? [{ to: '/studio', icon: 'potted_plant', label: 'Studio' }]
      : []),
    { to: '/profile', icon: 'person', label: 'Profile' },
  ]

  return (
    <nav
      className="fixed bottom-0 w-full z-50 flex justify-around items-center h-16 px-2"
      style={{
        background: 'rgba(14,14,14,0.95)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
      }}
    >
      {links.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:scale-90 ${
              isActive
                ? 'text-primary drop-shadow-[0_0_8px_rgba(114,254,143,0.4)]'
                : 'text-zinc-500 hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {icon}
              </span>
              <span className="text-[9px] uppercase tracking-widest font-bold">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
