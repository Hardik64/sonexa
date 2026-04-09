import React from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import MusicPlayer from '../components/MusicPlayer'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch {}
    logout()
    addToast('Logged out successfully.')
    navigate('/')
  }

  const roleColors = {
    artist: 'text-primary bg-primary/10 border-primary/20',
    user: 'text-on-surface-variant bg-surface-container-high border-white/10',
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-40">
      <TopBar title="Profile" showBack />

      <main className="pt-16 px-4 fade-in">
        {/* Hero */}
        <section className="py-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-surface-container-highest border-2 border-primary/30 flex items-center justify-center mb-4 primary-glow">
            <span className="material-symbols-outlined text-5xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-1">{user?.username}</h1>
          <p className="text-on-surface-variant text-sm mb-3">{user?.email}</p>
          <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${roleColors[user?.role] || roleColors.user}`}>
            {user?.role === 'artist' ? '🎵 Artist' : '🎧 Listener'}
          </span>
        </section>

        {/* Info cards */}
        <section className="space-y-3 mb-8">
          {[
            { icon: 'badge', label: 'Username', value: user?.username },
            { icon: 'mail', label: 'Email', value: user?.email },
            { icon: 'verified_user', label: 'Role', value: user?.role === 'artist' ? 'Artist / Creator' : 'User / Listener' },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 p-4 bg-surface-container rounded-xl">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant text-lg">{icon}</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{label}</p>
                <p className="text-white font-semibold text-sm">{value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Artist studio shortcut */}
        {user?.role === 'artist' && (
          <button
            onClick={() => navigate('/studio')}
            className="w-full flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-xl mb-3 hover:bg-primary/15 transition-colors"
          >
            <div className="w-10 h-10 rounded-full sonic-gradient flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-primary-container text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}>potted_plant</span>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm">Artist Studio</p>
              <p className="text-on-surface-variant text-xs">Upload music & create albums</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant ml-auto">chevron_right</span>
          </button>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 bg-error/10 border border-error/20 rounded-xl hover:bg-error/15 transition-colors mt-4"
        >
          <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-error text-lg">logout</span>
          </div>
          <span className="text-error font-bold text-sm">Log Out</span>
        </button>
      </main>

      <MusicPlayer />
      <BottomNav />
    </div>
  )
}
