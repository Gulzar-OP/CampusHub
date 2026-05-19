import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Lock, Phone, MapPin, GraduationCap,
  BookOpen, Hash, ChevronRight, ChevronLeft,
  Camera, CheckCircle2, AlertCircle, Loader2, University
} from 'lucide-react'
import toast from "react-hot-toast"

const ROLES = ['student', 'faculty', 'staff']
const YEARS = [1, 2, 3, 4, 5]

const STEPS = [
  { id: 'account', label: 'Account', description: 'Your login credentials' },
  { id: 'personal', label: 'Personal', description: 'Contact & location' },
  { id: 'college', label: 'College', description: 'Academic details' },
  { id: 'image', label: 'Proof', description: 'Profile & proof photos' },
]

const INITIAL_FORM = {
  collegeId: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: '',
  college: '',
  branch: '',
  year: '1',
  role: 'student',
}

function Field({ label, icon: Icon, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 flex items-center gap-1.5">
        {Icon && <Icon size={11} className="text-teal-500" />}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] text-rose-500 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-teal-500 focus:bg-white transition-all duration-200 ${className}`}
      {...props}
    />
  )
}

function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1">
              <motion.div
                animate={{
                  background: done ? '#0f766e' : active ? '#0d9488' : '#e5e7eb',
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ color: done || active ? '#fff' : '#9ca3af' }}
              >
                {done ? <CheckCircle2 size={15} /> : i + 1}
              </motion.div>
              <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-teal-700' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-2 mb-4" style={{ background: i < current ? '#0f766e' : '#e5e7eb' }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function AvatarPicker({ file, onChange }) {
  const ref = useRef(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => ref.current?.click()}
        className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-dashed border-teal-300 bg-teal-50 flex items-center justify-center group"
      >
        {preview ? (
          <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
        ) : (
          <Camera size={22} className="text-teal-400 group-hover:text-teal-600 transition-colors" />
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={18} className="text-white" />
        </div>
      </motion.button>
      <p className="text-xs text-gray-400">{file ? file.name : 'Upload profile photo'}</p>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onChange} />
    </div>
  )
}

function CollegeIdPicPicker({ file, onChange }) {
  const ref = useRef(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => ref.current?.click()}
        className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-dashed border-teal-300 bg-teal-50 flex items-center justify-center group"
      >
        {preview ? (
          <img src={preview} alt="Proof preview" className="w-full h-full object-cover" />
        ) : (
          <University size={22} className="text-teal-400 group-hover:text-teal-600 transition-colors" />
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <University size={18} className="text-white" />
        </div>
      </motion.button>
      <p className="text-xs text-gray-400">{file ? file.name : 'Upload college ID card'}</p>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onChange} />
    </div>
  )
}

function validateStep(step, form, avatar, collegeIdPic) {
  const errors = {}

  if (step === 0) {
    if (!form.name.trim()) errors.name = 'Required'
    if (!form.email.trim()) errors.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email'
    if (!form.password) errors.password = 'Required'
    else if (form.password.length < 6) errors.password = 'Min. 6 characters'
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match'
    if (!avatar) errors.avatar = 'Profile photo is required'
  }

  if (step === 1) {
    if (!form.phone.trim()) errors.phone = 'Required'
    else if (!/^\d{10}$/.test(form.phone)) errors.phone = '10-digit number'
    if (!form.address.trim()) errors.address = 'Required'
    if (!form.role.trim()) errors.role = 'Required'
  }

  if (step === 2) {
    if (!form.collegeId.trim()) errors.collegeId = 'Required'
    if (!form.college.trim()) errors.college = 'Required'
    if (!form.branch.trim()) errors.branch = 'Required'
  }

  if (step === 3) {
    if (!collegeIdPic) errors.collegeIdPic = 'College proof is required'
  }

  return errors
}

export default function Register() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL_FORM)
  const [avatar, setAvatar] = useState(null)
  const [collegeIdPic, setCollegeIdPic] = useState(null)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dir, setDir] = useState(1)

  const navigate = useNavigate()
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: undefined }))
  }

  const handleChangeCollegeId = (e) => {
    const cleanedValue = e.target.value.replace(/[-\s]/g, "")
    setForm(f => ({ ...f, collegeId: cleanedValue }))
    setErrors(er => ({ ...er, collegeId: undefined }))
  }

  const handleAvatar = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
      setErrors(er => ({ ...er, avatar: undefined }))
    }
  }

  const handleCollegeIdPic = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setCollegeIdPic(file)
      setErrors(er => ({ ...er, collegeIdPic: undefined }))
    }
  }

  const next = () => {
    const errs = validateStep(step, form, avatar, collegeIdPic)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setDir(1)
    setStep(s => s + 1)
  }

  const back = () => {
    setErrors({})
    setDir(-1)
    setStep(s => s - 1)
  }

  const handleSubmit = async () => {
    const errs = validateStep(step, form, avatar, collegeIdPic)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setApiError('')

    try {
      const fd = new FormData()
      fd.append('collegeId', form.collegeId)
      fd.append('name', form.name)
      fd.append('email', form.email)
      fd.append('password', form.password)
      fd.append('phone', form.phone)
      fd.append('address', form.address)
      fd.append('college', form.college)
      fd.append('branch', form.branch)
      fd.append('year', form.year)
      fd.append('role', form.role)
      fd.append('avatar', avatar)
      fd.append('image', collegeIdPic)

      await axios.post(`${API}/api/auth/register`, fd, { withCredentials: true })
      toast.success('Account created successfully! Please log in.')
      navigate('/login')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const variants = {
    enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 50%, #f8fafc 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');`}</style>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.9)',
          borderRadius: '28px',
          boxShadow: '0 8px 48px rgba(13,148,136,0.10), 0 1px 0 rgba(255,255,255,0.8) inset',
          padding: '36px 36px 32px',
        }}
      >
        <div className="flex items-center gap-2 mb-7">
          <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center bg-teal-700 text-white text-sm font-bold">
            <img src="/CampusHub_logo.png" alt="CampusHub Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-gray-800 text-sm">CampusHub</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
          Create account
        </h1>
        <p className="text-sm text-gray-400 mb-7">{STEPS[step].description}</p>

        <StepBar current={step} />

        <div className="overflow-hidden" style={{ minHeight: 320 }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-4"
            >
              {step === 0 && (
                <>
                  <AvatarPicker file={avatar} onChange={handleAvatar} />
                  {errors.avatar && (
                    <p className="text-[11px] text-rose-500 flex items-center gap-1 -mt-2">
                      <AlertCircle size={11} /> {errors.avatar}
                    </p>
                  )}
                  <Field label="Full Name" icon={User} error={errors.name}>
                    <Input name="name" placeholder="Gulzar Hussain" value={form.name} onChange={handleChange} />
                  </Field>
                  <Field label="Email" icon={Mail} error={errors.email}>
                    <Input name="email" type="email" placeholder="you@hit.edu.in" value={form.email} onChange={handleChange} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Password" icon={Lock} error={errors.password}>
                      <Input name="password" type="password" placeholder="Min. 6 chars" value={form.password} onChange={handleChange} />
                    </Field>
                    <Field label="Confirm" icon={Lock} error={errors.confirmPassword}>
                      <Input name="confirmPassword" type="password" placeholder="Repeat" value={form.confirmPassword} onChange={handleChange} />
                    </Field>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <Field label="Phone Number" icon={Phone} error={errors.phone}>
                    <Input name="phone" type="tel" placeholder="9876543210" value={form.phone} onChange={handleChange} maxLength={10} />
                  </Field>
                  <Field label="Address / City" icon={MapPin} error={errors.address}>
                    <Input name="address" placeholder="Haldia, West Bengal" value={form.address} onChange={handleChange} />
                  </Field>
                  <Field label="Role" icon={User} error={errors.role}>
                    <Select name="role" value={form.role} onChange={handleChange}>
                      {ROLES.map(r => (
                        <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                      ))}
                    </Select>
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <Field label="College ID" icon={User} error={errors.collegeId}>
                    <Input name="collegeId" placeholder="XXX-XX-XXXX" value={form.collegeId} onChange={handleChangeCollegeId} />
                  </Field>
                  <Field label="College / University" icon={GraduationCap} error={errors.college}>
                    <Input name="college" placeholder="Haldia Institute of Technology" value={form.college} onChange={handleChange} />
                  </Field>
                  <Field label="Branch / Department" icon={BookOpen} error={errors.branch}>
                    <Input name="branch" placeholder="Computer Science and Engineering" value={form.branch} onChange={handleChange} />
                  </Field>
                  <Field label="Year of Study" icon={Hash}>
                    <Select name="year" value={form.year} onChange={handleChange}>
                      {YEARS.map(y => (
                        <option key={y} value={y}>{y}{['st', 'nd', 'rd', 'th', 'th'][y - 1]} Year</option>
                      ))}
                    </Select>
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <CollegeIdPicPicker file={collegeIdPic} onChange={handleCollegeIdPic} />
                  {errors.collegeIdPic && (
                    <p className="text-[11px] text-rose-500 flex items-center gap-1 -mt-2">
                      <AlertCircle size={11} /> {errors.collegeIdPic}
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {apiError && (
          <p className="text-sm text-rose-500 flex items-center gap-1.5 mt-4">
            <AlertCircle size={14} /> {apiError}
          </p>
        )}

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <motion.button
              type="button"
              onClick={back}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all"
            >
              <ChevronLeft size={15} />
              Back
            </motion.button>
          )}

          {step < STEPS.length - 1 ? (
            <motion.button
              type="button"
              onClick={next}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)', boxShadow: '0 4px 16px rgba(13,148,136,0.25)' }}
            >
              Continue
              <ChevronRight size={15} />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)', boxShadow: '0 4px 16px rgba(13,148,136,0.25)' }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Creating account…
                </>
              ) : (
                <>
                  Create account <CheckCircle2 size={15} />
                </>
              )}
            </motion.button>
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{' '}
          <a href="/login" className="text-teal-700 font-semibold hover:underline">Sign in</a>
        </p>
      </motion.div>
    </div>
  )
}