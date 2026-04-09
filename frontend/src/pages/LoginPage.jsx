import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/Spinner'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()

  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      addToast('Please fill in all fields.', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.user)
      addToast(`Welcome back, ${res.data.user.username}!`)
      navigate('/home')
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{ background: 'rgba(114,254,143,0.06)', filter: 'blur(120px)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
        style={{ background: 'rgba(28,184,83,0.04)', filter: 'blur(100px)' }} />

      <main className="w-full max-w-[440px] z-10 fade-in">
        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 mb-4 rounded-xl flex items-center justify-center sonic-gradient primary-glow">
            <span className="material-symbols-outlined text-on-primary-container text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">Sonexa</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-medium tracking-wide">
            Enter the Digital Lounge
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-2xl border border-white/5 shadow-2xl">
          <h2 className="text-xl font-bold mb-8 tracking-tight">Log In</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface-variant">
                Username or Email
              </label>
              <input
                name="username"
                type="text"
                placeholder="Curator ID"
                value={form.username}
                onChange={handleChange}
                className="w-full bg-surface-container-lowest rounded-xl h-14 px-5 text-white placeholder-outline focus:ring-2 focus:ring-primary/40 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface-variant">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest rounded-xl h-14 px-5 pr-12 text-white placeholder-outline focus:ring-2 focus:ring-primary/40 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sonic-gradient h-14 rounded-full font-bold text-on-primary-container text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] transition-all duration-200 primary-glow disabled:opacity-60"
            >
              {loading ? <Spinner size="sm" /> : (
                <>
                  <span>Log In</span>
                  <span className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-on-surface-variant text-sm mb-4">Don't have an account?</p>
            <Link
              to="/register"
              className="inline-block w-full py-3 rounded-full border border-white/10 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors duration-200 text-white text-center"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          <Link to="/" className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest hover:text-on-surface transition-colors">
            ← Back
          </Link>
        </div>
      </main>
    </div>
  )
}
