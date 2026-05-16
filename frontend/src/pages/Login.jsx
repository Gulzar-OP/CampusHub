import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Lock, Loader2, AlertCircle,
  ShieldCheck, ArrowLeft, RotateCcw, KeyRound
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Shared primitives
───────────────────────────────────────────── */
function Field({ label, icon: Icon, error, right, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 flex items-center gap-1.5">
          {Icon && <Icon size={11} className="text-teal-500" />}
          {label}
        </label>
        {right}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-[11px] text-rose-500 flex items-center gap-1"
          >
            <AlertCircle size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm
        text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-teal-500
        focus:bg-white transition-all duration-200 ${className}`}
      {...props}
    />
  )
}

function ApiError({ msg }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5 mb-1"
        >
          <AlertCircle size={14} className="text-rose-500 shrink-0" />
          <span className="text-sm text-rose-600">{msg}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────
   OTP digit boxes
───────────────────────────────────────────── */
function OtpBoxes({ value, onChange, disabled }) {
  const refs = useRef([])
  const digits = value.split('')

  const handleKey = (e, i) => {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const next = [...digits]; next[i] = ''; onChange(next.join(''))
      } else if (i > 0) {
        refs.current[i - 1]?.focus()
      }
      return
    }
    if (e.key === 'ArrowLeft'  && i > 0) { refs.current[i - 1]?.focus(); return }
    if (e.key === 'ArrowRight' && i < 5) { refs.current[i + 1]?.focus(); return }
  }

  const handleChange = (e, i) => {
    const raw = e.target.value.replace(/\D/g, '').slice(-1)
    if (!raw) return
    const next = [...digits]; next[i] = raw
    onChange(next.join('').slice(0, 6))
    if (i < 5) refs.current[i + 1]?.focus()
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted) { onChange(pasted); refs.current[Math.min(pasted.length, 5)]?.focus() }
    e.preventDefault()
  }

  return (
    <div className="flex gap-2.5 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.input
          key={i}
          ref={el => refs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          disabled={disabled}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKey(e, i)}
          onPaste={handlePaste}
          whileFocus={{ scale: 1.08 }}
          className={`w-11 text-center text-lg font-bold rounded-xl border-2 bg-gray-50
            focus:outline-none transition-all duration-150 disabled:opacity-50
            ${digits[i]
              ? 'border-teal-500 bg-teal-50 text-teal-700'
              : 'border-gray-200 text-gray-800 focus:border-teal-400'
            }`}
          style={{ height: '3.25rem' }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Resend countdown
───────────────────────────────────────────── */
function ResendTimer({ email }) {
  const [secs, setSecs] = useState(30)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (secs <= 0) return
    const t = setTimeout(() => setSecs(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secs])

  const resend = async () => {
    setBusy(true)
    try {
      await axios.post('http://localhost:4000/api/auth/resend-otp', { email })
      setSecs(30)
    } catch { /* silent */ } finally { setBusy(false) }
  }

  return secs > 0
    ? <p className="text-xs text-gray-400 text-center">
        Resend code in <span className="text-teal-600 font-semibold tabular-nums">{secs}s</span>
      </p>
    : <button
        type="button" onClick={resend} disabled={busy}
        className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold mx-auto hover:underline disabled:opacity-50"
      >
        <RotateCcw size={12} className={busy ? 'animate-spin' : ''} />
        {busy ? 'Sending…' : 'Resend code'}
      </button>
}

/* ─────────────────────────────────────────────
   LOGIN PANEL
───────────────────────────────────────────── */
function LoginPanel({ onOtpRequired }) {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [errors, setErrors]   = useState({})
  const [apiErr, setApiErr]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: undefined }))
    setApiErr('')
  }

  const validate = () => {
    const errs = {}
    if (!form.email.trim())                     errs.email    = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email    = 'Invalid email'
    if (!form.password)                         errs.password = 'Required'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true); setApiErr('')
    try {
      const { data } = await axios.post(
        `${API}/api/auth/login`,
        form,
        { withCredentials: true }
      )
      // ← unverified: slide to OTP view inside the same card
      if (data.requiresOTP) { onOtpRequired(data.email); return }
      // ← verified: cookie set by server, go home
      navigate('/')
    } catch (err) {
      setApiErr(err.response?.data?.message || 'Invalid credentials. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
        Welcome back
      </h1>
      <p className="text-sm text-gray-400 mb-6">Sign in to your campus account.</p>

      <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-xl px-3.5 py-2.5 mb-5">
        <ShieldCheck size={14} className="text-teal-500 shrink-0" />
        <span className="text-xs text-teal-700 font-medium">Session secured with httpOnly cookie</span>
      </div>

      <ApiError msg={apiErr} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <Field label="Email" icon={Mail} error={errors.email}>
          <Input name="email" type="email" placeholder="you@hit.edu.in"
            value={form.email} onChange={handleChange} autoComplete="email" />
        </Field>
        <Field
          label="Password" icon={Lock} error={errors.password}
          right={
            <Link to="/forgot-password" className="text-[11px] text-teal-700 font-semibold hover:underline">
              Forgot password?
            </Link>
          }
        >
          <Input name="password" type="password" placeholder="Enter your password"
            value={form.password} onChange={handleChange} autoComplete="current-password" />
        </Field>

        <motion.button
          type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
            text-white mt-1 disabled:opacity-70"
          style={{ background: 'linear-gradient(135deg,#0d9488,#0f766e)', boxShadow: '0 4px 16px rgba(13,148,136,.25)' }}
        >
          {loading ? <><Loader2 size={15} className="animate-spin" />Signing in…</> : 'Sign in'}
        </motion.button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-5">
        Don't have an account?{' '}
        <Link to="/register" className="text-teal-700 font-semibold hover:underline">Create one</Link>
      </p>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   OTP PANEL
───────────────────────────────────────────── */
function OtpPanel({ email, onBack }) {
  const [otp, setOtp]         = useState('')
  const [apiErr, setApiErr]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const verify = async (code) => {
    if ((code ?? otp).length < 6) { setApiErr('Please enter all 6 digits.'); return }
    setLoading(true); setApiErr('')
    try {
      await axios.post(
        `${API}/api/auth/verify-otp`,
        { email, otp: code ?? otp },
        { withCredentials: true }
      )
      navigate('/')
    } catch (err) {
      setApiErr(err.response?.data?.message || 'Incorrect OTP. Please try again.')
    } finally { setLoading(false) }
  }

  // auto-submit when 6 digits are filled
  const handleOtpChange = (val) => {
    setOtp(val)
    setApiErr('')
    if (val.length === 6) verify(val)
  }

  const masked = email
    ? email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => a + '*'.repeat(b.length) + c)
    : ''

  return (
    <motion.div
      key="otp"
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button" onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-teal-600 mb-6 transition-colors"
      >
        <ArrowLeft size={13} /> Back to sign in
      </button>

      <div className="flex justify-center mb-5">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4, delay: 0.1 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#ccfbf1,#99f6e4)' }}
        >
          <KeyRound size={26} className="text-teal-600" />
        </motion.div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
        Check your email
      </h1>
      <p className="text-sm text-gray-400 text-center mb-7">
        We sent a 6-digit code to{' '}
        <span className="text-gray-600 font-medium">{masked}</span>
      </p>

      <ApiError msg={apiErr} />

      <div className="mt-2 mb-6">
        <OtpBoxes value={otp} onChange={handleOtpChange} disabled={loading} />
      </div>

      <motion.button
        type="button" onClick={() => verify()} disabled={loading || otp.length < 6} whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
          text-white mb-4 disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg,#0d9488,#0f766e)', boxShadow: '0 4px 16px rgba(13,148,136,.25)' }}
      >
        {loading ? <><Loader2 size={15} className="animate-spin" />Verifying…</> : 'Verify & Sign in'}
      </motion.button>

      <ResendTimer email={email} />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   ROOT — single card, two panels
───────────────────────────────────────────── */
export default function Login() {
  // null = show login  |  "email@..." = show OTP
  const [otpEmail, setOtpEmail] = useState(null)
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg,#f0fdfa 0%,#ffffff 50%,#f8fafc 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');`}</style>

      {/* motion.div layout = card smoothly resizes as content changes */}
      <motion.div
        layout
        transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
        className="w-full max-w-md overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.9)',
          borderRadius: '28px',
          boxShadow: '0 8px 48px rgba(13,148,136,0.10), 0 1px 0 rgba(255,255,255,0.8) inset',
          padding: '36px 36px 32px',
        }}
      >
        {/* Brand — always visible */}
        <div className="flex items-center gap-2 mb-7">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg,#0d9488,#0f766e)' }}
          >C</div>
          <span className="font-semibold text-gray-800 text-sm">CampusHub</span>
        </div>

        <AnimatePresence mode="wait">
          {otpEmail === null
            ? <LoginPanel key="login" onOtpRequired={email => setOtpEmail(email)} />
            : <OtpPanel   key="otp"   email={otpEmail} onBack={() => setOtpEmail(null)} />
          }
        </AnimatePresence>
      </motion.div>
    </div>
  )
}