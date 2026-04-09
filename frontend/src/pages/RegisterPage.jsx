import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/Spinner'

const Field = ({ name, label, type = 'text', placeholder, form, errors, handleChange, children }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
      {label}
    </label>
    <div className="relative">
      {children || (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          className={`w-full bg-surface-container-lowest rounded-xl py-4 px-4 text-white placeholder-outline focus:ring-1 transition-all ${
            errors[name] ? 'ring-1 ring-error' : 'focus:ring-primary/30'
          }`}
        />
      )}
    </div>
    {errors[name] && (
      <p className="text-error text-xs font-medium flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">error</span>
        {errors[name]}
      </p>
    )}
  </div>
)

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()

  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.username.trim() || form.username.length < 6 || form.username.length > 20) {
      e.username = 'Username must be 6-20 characters'
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Valid email required'
    }
    if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await registerUser(form)
      login(res.data.user)
      addToast(`Welcome to Sonexa, ${res.data.user.username}!`)
      navigate('/home')
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
        style={{ background: 'rgba(114,254,143,0.05)', filter: 'blur(120px)' }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
        style={{ background: 'rgba(136,235,255,0.03)', filter: 'blur(120px)' }} />

      <main className="w-full max-w-[480px] z-10 fade-in">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1 italic">Sonexa</h1>
          <p className="text-on-surface-variant text-sm font-medium tracking-wide uppercase">
            Join the Sound Revolution
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-container rounded-xl p-8 md:p-10 ambient-glow relative overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />

          <form onSubmit={handleSubmit} className="relative space-y-5">
            <Field name="username" label="Username" placeholder="curator_vibes" form={form} errors={errors} handleChange={handleChange} />
            <Field name="email" label="Email Address" type="email" placeholder="hello@sonexa.com" form={form} errors={errors} handleChange={handleChange} />

            {/* Password with toggle */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full bg-surface-container-lowest rounded-xl py-4 px-4 pr-12 text-white placeholder-outline focus:ring-1 transition-all ${
                    errors.password ? 'ring-1 ring-error' : 'focus:ring-primary/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Account Type
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest rounded-xl py-4 px-4 text-white appearance-none focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
                >
                  <option value="user">User / Listener</option>
                  <option value="artist">Artist / Creator</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>

            {/* Role info badge */}
            {form.role === 'artist' && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <span className="material-symbols-outlined text-primary text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                <p className="text-xs text-primary font-medium">
                  As an artist you can upload music and create albums.
                </p>
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sonic-gradient text-on-primary-container font-bold py-4 rounded-full flex items-center justify-center gap-3 active:scale-95 transition-transform duration-200 primary-glow disabled:opacity-60"
              >
                {loading ? <Spinner size="sm" /> : (
                  <>
                    <span>Create Account</span>
                    <span className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-on-surface-variant text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-bold ml-1">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
