import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) navigate('/home')
  }, [user])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface">
      {/* Ambient bg blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(114,254,143,0.07) 0%, transparent 70%)' }} />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: 'rgba(114,254,143,0.04)', filter: 'blur(80px)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full"
          style={{ background: 'rgba(28,184,83,0.05)', filter: 'blur(80px)' }} />
      </div>

      {/* Header */}
      <header className="absolute top-0 w-full flex items-center px-6 h-16 z-10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
          <span className="text-lg font-black tracking-tighter text-white">Sonexa</span>
        </div>
      </header>

      {/* Main card */}
      <main className="relative z-10 w-full max-w-md px-4 fade-in">
        <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl border border-white/5 flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto"
              style={{ background: 'rgba(114,254,143,0.1)' }}>
              <span className="material-symbols-outlined text-primary text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Sonexa</h1>
            <p className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">
              Music for everyone.
            </p>
          </div>

          {/* CTAs */}
          <div className="w-full space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full h-14 rounded-full sonic-gradient text-on-primary-container font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 transition-all duration-200 primary-glow"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>login</span>
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full h-14 rounded-full border-2 border-white/20 text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/40 active:scale-95 transition-all duration-200"
            >
              <span className="material-symbols-outlined">person_add</span>
              Create Account
            </button>
          </div>

          {/* Divider */}
          <div className="mt-10 w-full pt-8 border-t border-white/5">
            <p className="text-on-surface-variant text-xs mb-1 font-medium">
              Premium music streaming experience
            </p>
            <p className="text-on-surface-variant/50 text-xs">
              Upload, curate, and discover music.
            </p>
          </div>
        </div>
      </main>

      {/* Decorative text */}
      <div className="absolute top-1/2 -right-16 -translate-y-1/2 z-0 pointer-events-none select-none opacity-[0.04]">
        <p className="text-[10rem] font-black text-white rotate-90"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>
          SONIC
        </p>
      </div>
    </div>
  )
}
